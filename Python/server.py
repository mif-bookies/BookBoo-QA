import logging

import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from scipy.sparse import csr_matrix
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)
CORS(app)
app.logger.setLevel(logging.INFO)
app.logger.info('Server started')
# ---------------------------------------------------------------------------------------------------------------- #
# Load data
# ---------------------------------------------------------------------------------------------------------------- #

app.logger.info('Loading data')
books_df = pd.read_csv('books.csv')
user_ratings_df = pd.read_csv('ratings.csv')

# ---------------------------------------------------------------------------------------------------------------- #
# Collaborative Filtering
# ---------------------------------------------------------------------------------------------------------------- #

app.logger.info('Collaborative filtering initialization')
user_item_matrix = user_ratings_df.pivot(index='user_id', columns='book_id', values='rating').fillna(0)
user_item_matrix_sparse = csr_matrix(user_item_matrix.values)
user_item_matrix_sparse_T = user_item_matrix_sparse.transpose()

model_knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=20, n_jobs=-1)
model_knn.fit(user_item_matrix_sparse_T)

book_id_to_idx = {book_id: idx for idx, book_id in enumerate(user_item_matrix.columns)}

def collaborative_recommendations(book_id, top_n=10):
    if book_id not in book_id_to_idx:
        return pd.DataFrame()

    book_idx = book_id_to_idx[book_id]
    _, indices = model_knn.kneighbors(user_item_matrix_sparse_T[book_idx].reshape(1, -1), n_neighbors=top_n+1)
    book_indices = [user_item_matrix.columns[i] for i in indices.flatten()[1:]]
    return books_df[books_df['book_id'].isin(book_indices)]

app.logger.info('Collaborative filtering initialization finished')

# ---------------------------------------------------------------------------------------------------------------- #
# Content-Based Filtering
# ---------------------------------------------------------------------------------------------------------------- #

app.logger.info('Content-based filtering initialization')
books_df['content'] = (pd.Series(books_df[['authors', 'title', 'genres', 'description']]
                                  .fillna('')
                                  .values.tolist()
                                  ).str.join(' '))

tf_content = TfidfVectorizer(analyzer='word', ngram_range=(1, 2), min_df=0., stop_words='english')
tfidf_matrix = tf_content.fit_transform(books_df['content'])

cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

def content_based_recommendations(book_id, top_n=50, cosine_sim=cosine_sim, df=books_df):
    if book_id not in df['book_id'].values:
        return pd.DataFrame()

    book_id_to_index = pd.Series(df.index, index=df['book_id'])
    
    idx = book_id_to_index[book_id]

    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    top_n = min(top_n, len(sim_scores) - 1)
    sim_scores = sim_scores[1:top_n+1]
    
    book_indices = [i[0] for i in sim_scores]
    books_subset = df.iloc[book_indices][['book_id', 'title', 'authors', 'average_rating', 'ratings_count']]

    v = books_subset['ratings_count']
    m = books_subset['ratings_count'].quantile(0.75)
    R = books_subset['average_rating']
    C = books_subset['average_rating'].median()
    books_subset['new_score'] = (v / (v + m) * R) + (m / (m + v) * C)

    high_rating = books_subset[books_subset['ratings_count'] >= m]
    high_rating = high_rating.sort_values('new_score', ascending=False)

    return df.loc[high_rating.index]

# ---------------------------------------------------------------------------------------------------------------- #
# Hybrid method
# ---------------------------------------------------------------------------------------------------------------- #

app.logger.info('Combining collaborative and content-based recommendation methods into hybrid method')
def hybrid_recommendations(book_id, top_n=10):
    content_recommendations = content_based_recommendations(book_id)
    collab_recommendations = collaborative_recommendations(book_id, top_n=top_n)
    hybrid_recommendations_df = pd.concat([content_recommendations, collab_recommendations]).drop_duplicates().head(top_n)
    return hybrid_recommendations_df

app.logger.info('Server ready for use!')
@app.route('/recommend', methods=['GET'])
def recommend():
    app.logger.info('Generating book recommendations')
    book_id = request.args.get('book_id', type=int)
    method = request.args.get('method', default="Content-Based")
    limit = request.args.get('limit', default=10, type=int)

    try:
        recommendations = pd.DataFrame()
        if method == 'Content-Based':
            recommendations = content_based_recommendations(book_id)
        elif method == 'Collaborative':
            recommendations = collaborative_recommendations(book_id, top_n=limit)
        else:
            recommendations = hybrid_recommendations(book_id, top_n=limit)

        if recommendations.empty:
            return jsonify({"message": "No recommendations found"}), 404

        recommendations_json = recommendations.to_dict(orient='records')
        recommendations_json = [book['book_id'] for book in recommendations_json]
        return jsonify(recommendations_json), 200
    except Exception as e:
        app.logger.error(f'An error occurred while generating recommendations: {e}')
        return jsonify({"error": str(e)}), 500
    
if __name__ == '__main__':
    app.run(host="127.0.0.1", port=5000, debug=True)