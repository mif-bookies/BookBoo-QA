import { faAtom } from "@fortawesome/free-solid-svg-icons/faAtom";
import { faBook } from "@fortawesome/free-solid-svg-icons/faBook";
import { faBrain } from "@fortawesome/free-solid-svg-icons/faBrain";
import { faBriefcase } from "@fortawesome/free-solid-svg-icons/faBriefcase";
import { faBurst } from "@fortawesome/free-solid-svg-icons/faBurst";
import { faChild } from "@fortawesome/free-solid-svg-icons/faChild";
import { faQuestion } from "@fortawesome/free-solid-svg-icons/faQuestion";
import { faCross } from "@fortawesome/free-solid-svg-icons/faCross";
import { faDna } from "@fortawesome/free-solid-svg-icons/faDna";
import { faDragon } from "@fortawesome/free-solid-svg-icons/faDragon";
import { faDroplet } from "@fortawesome/free-solid-svg-icons/faDroplet";
import { faDumbbell } from "@fortawesome/free-solid-svg-icons/faDumbbell";
import { faExplosion } from "@fortawesome/free-solid-svg-icons/faExplosion";
import { faGhost } from "@fortawesome/free-solid-svg-icons/faGhost";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons/faEarthAmericas";
import { faHandcuffs } from "@fortawesome/free-solid-svg-icons/faHandcuffs";
import { faHandshakeAngle } from "@fortawesome/free-solid-svg-icons/faHandshakeAngle";
import { faHeart } from "@fortawesome/free-solid-svg-icons/faHeart";
import { faHeartPulse } from "@fortawesome/free-solid-svg-icons/faHeartPulse";
import { faHourglassEnd } from "@fortawesome/free-solid-svg-icons/faHourglassEnd";
import { faHourglassHalf } from "@fortawesome/free-solid-svg-icons/faHourglassHalf";
import { faMasksTheater } from "@fortawesome/free-solid-svg-icons/faMasksTheater";
import { faMusic } from "@fortawesome/free-solid-svg-icons/faMusic";
import { faPalette } from "@fortawesome/free-solid-svg-icons/faPalette";
import { faPenFancy } from "@fortawesome/free-solid-svg-icons/faPenFancy";
import { faSatelliteDish } from "@fortawesome/free-solid-svg-icons/faSatelliteDish";
import { faScroll } from "@fortawesome/free-solid-svg-icons/faScroll";
import { faUtensils } from "@fortawesome/free-solid-svg-icons/faUtensils";
import { faVenus } from "@fortawesome/free-solid-svg-icons/faVenus";
import { faVenusDouble } from "@fortawesome/free-solid-svg-icons/faVenusDouble";
import { faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons/faWandMagicSparkles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { View } from "react-native";

interface Props {
  genres: string[];
  count?: number;
}

const MAX_ICONS = 3;

const GenreIconList = ({ genres, count }: Props) => {
  const genresMap = [
    {
      genre: "self-help",
      icon: faHandshakeAngle,
      color: "#52525b",
    },
    {
      genre: "thriller",
      icon: faDroplet,
      color: "#b91c1c",
    },
    {
      genre: "romance",
      icon: faHeart,
      color: "#dc2626",
    },
    {
      genre: "chick-lit",
      icon: faVenus,
      color: "#f87171",
    },
    {
      genre: "humor-and-comedy",
      icon: faMasksTheater,
      color: "#475569",
    },
    {
      genre: "religion",
      icon: faCross,
      color: "#f59e0b",
    },
    {
      genre: "mystery",
      icon: faWandMagicSparkles,
      color: "#5b21b6",
    },
    {
      genre: "psychology",
      icon: faBrain,
      color: "#fca5a5",
    },
    {
      genre: "christian",
      icon: faCross,
      color: "#f59e0b",
    },
    {
      genre: "fiction",
      icon: faScroll,
      color: "#fdba74",
    },
    {
      genre: "horror",
      icon: faGhost,
      color: "#a3a3a3",
    },
    {
      genre: "graphic-novels",
      icon: faExplosion,
      color: "#1e293b",
    },
    {
      genre: "travel",
      icon: faEarthAmericas,
      color: "#0284c7",
    },
    {
      genre: "business",
      icon: faBriefcase,
      color: "#713f12",
    },
    {
      genre: "memoir",
      icon: faPenFancy,
      color: "#44403c",
    },
    {
      genre: "crime",
      icon: faHandcuffs,
      color: "#334155",
    },
    {
      genre: "history",
      icon: faHourglassHalf,
      color: "#a16207",
    },
    {
      genre: "historical-fiction",
      icon: faHourglassEnd,
      color: "#a16207",
    },
    {
      genre: "poetry",
      icon: faPenFancy,
      color: "#44403c",
    },
    {
      genre: "philosophy",
      icon: faQuestion,
      color: "#6d28d9",
    },
    {
      genre: "young-adult",
      icon: faChild,
      color: "#f87171",
    },
    {
      genre: "paranormal",
      icon: faGhost,
      color: "#a3a3a3",
    },
    {
      genre: "comics",
      icon: faExplosion,
      color: "#e11d48",
    },
    {
      genre: "fantasy",
      icon: faDragon,
      color: "#701a75",
    },
    {
      genre: "spirituality",
      icon: faCross,
      color: "#f59e0b",
    },
    {
      genre: "gay-and-lesbian",
      icon: faVenusDouble,
      color: "#f87171",
    },
    {
      genre: "art",
      icon: faPalette,
      color: "#f59e0b",
    },
    {
      genre: "science",
      icon: faAtom,
      color: "#3b82f6",
    },
    {
      genre: "suspense",
      icon: faDroplet,
      color: "#b91c1c",
    },
    {
      genre: "biography",
      icon: faDna,
      color: "#dc2727",
    },
    {
      genre: "manga",
      icon: faBurst,
      color: "#e11d48",
    },
    {
      genre: "sports",
      icon: faDumbbell,
      color: "#1f2937",
    },
    {
      genre: "music",
      icon: faMusic,
      color: "#1d4ed8",
    },
    {
      genre: "contemporary",
      icon: faScroll,
      color: "#fdba74",
    },
    {
      genre: "cookbooks",
      icon: faUtensils,
      color: "#6b7280",
    },
    {
      genre: "nonfiction",
      icon: faHeartPulse,
      color: "#dc2727",
    },
    {
      genre: "classics",
      icon: faScroll,
      color: "#fdba74",
    },
    {
      genre: "science-fiction",
      icon: faSatelliteDish,
      color: "#3b82f6",
    },
    {
      genre: "books",
      icon: faBook,
      color: "#713f12",
    },
  ];
  const iconCount = count !== undefined ? count : MAX_ICONS;

  return (
    <View className="flex-row flex-wrap gap-3">
      {genres.slice(0, iconCount || genres.length).map((genre) => {
        const genreMap = genresMap.find((g) => g.genre === genre);
        if (!genreMap) return null;
        return (
          <FontAwesomeIcon
            key={genre}
            color={genreMap.color || "#52525b"}
            icon={genreMap.icon}
            size={28}
          />
        );
      })}
    </View>
  );
};

export default GenreIconList;
