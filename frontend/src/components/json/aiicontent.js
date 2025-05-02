// productsData.js
import { FlagIcon } from "../iconsSvg/CustomIcon";
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
    title: "Flags",
    svg: <FlagIcon />
  },
  {
    id: 4,
    title: "Flags",
    svg: <FlagIcon />
  },
  {
    id: 5,
    title: "Flags",
    svg: <FlagIcon />
  },
  {
    id: 6,
    title: "Flags",
    svg: <FlagIcon />
  },
  {
    id: 7,
    title: "Flags",
    svg: <FlagIcon />
  },
  {
    id: 8,
    title: "Flags",
    svg: <FlagIcon />
  },
  {
    id: 9,
    title: "Flags",
    svg: <FlagIcon />
  },
  {
    id: 10,
    title: "Flags",
    svg: <FlagIcon />
  },
  {
    id: 11,
    title: "Flags",
    svg: <FlagIcon />
  },
  {
    id: 12,
    title: "Flags",
    svg: <FlagIcon />
  },
  {
    id: 13,
    title: "Flags",
    svg: <FlagIcon />
  },
  {
    id: 14,
    title: "Flags",
    svg: <FlagIcon />
  },
  {
    id: 15,
    title: "Flags",
    svg: <FlagIcon />
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

