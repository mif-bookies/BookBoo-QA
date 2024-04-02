import ast
import re

import pandas as pd


def escape_sql_string(value):
    return value.replace("'", "''")

def str_to_list(string_list):
    try:
        return ast.literal_eval(string_list)
    except ValueError:
        return []
    
def clean_description(description):
    description = re.sub(r'[^\x20-\x7E]', '', description)
    description = description.replace('\\', '\\\\')
    description = description.replace("'", "''")
    description = re.sub(r'\s+', ' ', description).strip()
    
    return description

def generate_chunked_book_inserts(df, chunk_size=5000):
    chunks = [df[i:i + chunk_size] for i in range(0, df.shape[0], chunk_size)]
    book_inserts = []

    for chunk in chunks:
        book_values = []
        for index, row in chunk.iterrows():
            title = escape_sql_string(row['title'])
            description = clean_description(row['description'])
            normalized_title = escape_sql_string(row['normalized_title'])
            image_url = escape_sql_string(row['image_url'])

            book_values.append(f"({row['book_id']}, '{title}', {row['average_rating']}, {row['ratings_count']}, '{image_url}', {row['pages']}, '{description}', '{normalized_title}', '{row['original_publication_year']}')")

        book_insert_start = 'INSERT INTO "Book" ("id", "title", "average_rating", "ratings_count", "cover_image", "page_count", "description", "normalized_title", "publication_year") VALUES '
        book_inserts.append(book_insert_start + ', '.join(book_values) + ';')

    return book_inserts

def generate_combined_sql_inserts(df, num_rows=None):
    if num_rows is not None:
        df = df.head(num_rows)

    author_insert_start = 'INSERT INTO "BookAuthor" ("book_id", "name") VALUES '
    genre_insert_start = 'INSERT INTO "BookGenre" ("book_id", "genre") VALUES '

    author_values = []
    genre_values = []

    for index, row in df.iterrows():
        authors = str_to_list(row['authors'])
        for author in authors:
            author_name = escape_sql_string(author)
            author_values.append(f"({row['book_id']}, '{author_name}')")

        genres = str_to_list(row['genres'])
        for genre in genres:
            genre_name = escape_sql_string(genre)
            genre_values.append(f"({row['book_id']}, '{genre_name}')")

    author_insert = author_insert_start + ', '.join(author_values) + ';'
    genre_insert = genre_insert_start + ', '.join(genre_values) + ';'

    return author_insert, genre_insert


def write_chunks_to_files(book_inserts, base_filename='book_inserts_chunk'):
    for i, insert_statement in enumerate(book_inserts):
        filename = f"{base_filename}_{i+1}.sql"
        with open(f'{filename}', 'w', encoding='utf-8') as file:
            file.write(insert_statement)
        print(f"Chunk {i+1} written to {filename}")


books_df = pd.read_csv("books.csv", encoding="utf-8")

num_rows = None  # Replace None with the desired number of rows or leave it as None to process the entire document
author_inserts, genre_inserts = generate_combined_sql_inserts(books_df, num_rows)
book_inserts = generate_chunked_book_inserts(books_df, chunk_size=num_rows)

write_chunks_to_files(book_inserts)

with open('author_inserts.sql', 'w', encoding="utf-8") as f:
    f.write(author_inserts)

with open('genre_inserts.sql', 'w', encoding="utf-8") as f:
    f.write(genre_inserts)