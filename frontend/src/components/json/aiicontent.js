// productsData.js
import { BearIcon, BuildingIcon, DumbbellIcon, FlagIcon, MilitaryIcon, MusicIcon, MusieumIcon, PawIcon, ReligionIcon, RestaurantIcon, SettingsIcon, ShapesIcon, UmbrellaIcon, VectorIcon } from "../iconsSvg/CustomIcon";
import { NatureSvg } from "../iconsSvg/CustomIcon";
import FlagImage from '../images/FlagImage.png'
import NatureImage from '../images/flagimg2.png'
const aiContent = [
  {
    id: 1,
    title: "Flags",
    svg: <FlagIcon />
  },
  {
    id: 2,
    title: "Nature",
    svg: <NatureSvg />
  },
  {
    id: 3,
    title: "Music",
    svg: <MusicIcon />
  },
  {
    id: 4,
    title: "Military",
    svg: <MilitaryIcon />
  },
  {
    id: 5,
    title: "Designs",
    svg: <VectorIcon />
  },
  {
    id: 6,
    title: "Animals",
    svg: <PawIcon />
  },
  {
    id: 7,
    title: "Office",
    svg: <BuildingIcon />
  },
  {
    id: 8,
    title: "Food",
    svg: <RestaurantIcon />
  },
  {
    id: 9,
    title: "Greek",
    svg: <MusieumIcon />
  },
  {
    id: 10,
    title: "Sports",
    svg: <DumbbellIcon/>
  },
  {
    id: 11,
    title: "Mascots",
    svg: <BearIcon />
  },
  {
    id: 12,
    title: "Jobs",
    svg: <SettingsIcon />
  },
  {
    id: 13,
    title: "Holidays",
    svg: <UmbrellaIcon />
  },
  {
    id: 14,
    title: "Shapes",
    svg: <ShapesIcon />
  },
  {
    id: 15,
    title: "Religion",
    svg: <ReligionIcon />
  }


  // more...
];
const categoryImages = {
  Flags: [
    { id: 1, src: FlagImage, alt: "USA" },
    { id: 2, src: FlagImage, alt: "Canada" },
    { id: 3, src: FlagImage, alt: "UK" },
    { id: 4, src: FlagImage, alt: "Ukraine" },
    { id: 5, src: FlagImage, alt: "Jamaica" },

  ],
  Nature: [
    { id: 1, src: NatureImage, alt: "Tree" },
   
  ],

};



export {aiContent,categoryImages};

