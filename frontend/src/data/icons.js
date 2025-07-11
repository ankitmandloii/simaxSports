
// const icons = {
//     delete:
//         "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='31' fill='%23fff' stroke='%23ccc' stroke-width='2'/%3E%3Cpath fill='%23666' d='M24 20v-2a2 2 0 012-2h12a2 2 0 012 2v2h8v4H16v-4h8zm2 0h12v-2H26v2zm-4 6h20l-2 24H24l-2-24z'/%3E%3C/svg%3E",
//     rotate:
//         "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' cx='32' cy='32' r='32'/%3E%3Cpath fill='%23666666' d='M32 12a20 20 0 1 1-14.14 5.86l3.54 3.54A16 16 0 1 0 32 16v6l8-8-8-8v6z'/%3E%3C/svg%3E",
//     resize:
//         "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik00NCA0NEgzNnY0aDh2LThoLTRaTTIwIDIwaDh2LTRoLTh2OGg0WiIvPjwvc3ZnPg==",
//     layer:
//         "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik0xNiAzNmwxNiAxMCAxNi0xMC0xNi0xMC0xNiAxMHptMC02bDE2LTEwIDE2IDEwLTE2IDEwLTE2LTEweiIvPjwvc3ZnPg==",
//     width:
//         "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjkiIGhlaWdodD0iMjciIHZpZXdCb3g9IjAgMCAyOSAyNyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjkiIGhlaWdodD0iMjciIGZpbGw9IndoaXRlIi8+CiAgPHJlY3QgeD0iMSIgeT0iMSIgd2lkdGg9IjI3IiBoZWlnaHQ9IjI1IiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxwb2x5Z29uIHBvaW50cz0iNSwxMy41IDExLDkgMTEsMTgiIGZpbGw9IiMzMzMiLz4KICA8cG9seWdvbiBwb2ludHM9IjI0LDEzLjUgMTgsOSAxOCwxOCIgc3Ryb2tlPSJub25lIiBmaWxsPSIjMzMzIi8+Cjwvc3ZnPg==",
//     height: 
//         "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjciIGhlaWdodD0iMjkiIHZpZXdCb3g9IjAgMCAyNyAyOSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjciIGhlaWdodD0iMjkiIGZpbGw9IndoaXRlIi8+CiAgPHJlY3QgeD0iMSIgeT0iMSIgd2lkdGg9IjI1IiBoZWlnaHQ9IjI3IiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxwb2x5Z29uIHBvaW50cz0iMTMuNSw1IDksMTEgMTgsMTEiIGZpbGw9IiMzMzMiLz4KICA8cG9seWdvbiBwb2ludHM9IjEzLjUsMjQgOSwxOCAxOCwxOCIgc3Ryb2tlPSJub25lIiBmaWxsPSIjMzMzIi8+Cjwvc3ZnPg==",
//     layerUp:
//     "data:image/svg+xml,%3Csvg width='27' height='29' viewBox='0 0 27 29' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='27' height='29' fill='white'/%3E%3Crect x='1' y='1' width='25' height='27' fill='none' stroke='%23999' stroke-width='1'/%3E%3Cpolygon points='13.5,5 9,11 18,11' fill='%23333'/%3E%3Cpolygon points='13.5,24 9,18 18,18' stroke='none' fill='%23333'/%3E%3C/svg%3E",
//   layerDown:
//     "data:image/svg+xml,%3Csvg width='a27' height='29' viewBox='0 0 27 29' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='27' height='29' fill='white'/%3E%3Crect x='1' y='1' width='25' height='27' fill='none' stroke='%23999' stroke-width='1'/%3E%3Cpolygon points='13.5,5 9,11 18,11' fill='%23333'/%3E%3Cpolygon points='13.5,24 9,18 18,18' stroke='none' fill='%23333'/%3E%3C/svg%3E",
//   layerTop:
//     "data:image/svg+xml,%3Csvg width='27' height='29' viewBox='0 0 27 29' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='27' height='29' fill='white'/%3E%3Crect x='1' y='1' width='25' height='27' fill='none' stroke='%23999' stroke-width='1'/%3E%3Cpolygon points='13.5,5 9,11 18,11' fill='%23333'/%3E%3Cpolygon points='13.5,24 9,18 18,18' stroke='none' fill='%23333'/%3E%3C/svg%3E",
//   layerBottom:
//     "data:image/svg+xml,%3Csvg width='27' height='29' viewBox='0 0 27 29' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='27' height='29' fill='white'/%3E%3Crect x='1' y='1' width='25' height='27' fill='none' stroke='%23999' stroke-width='1'/%3E%3Cpolygon points='13.5,5 9,11 18,11' fill='%23333'/%3E%3Cpolygon points='13.5,24 9,18 18,18' stroke='none' fill='%23333'/%3E%3C/svg%3E",
// };

// export default icons;



const svgResizeIcon = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <g transform="translate(4 4) rotate(90 8 8)" id="Layer_2" data-name="Layer 2">
    <g id="Layer_1-2" data-name="Layer 1">
      <polygon points="9 0 11.79 2.79 8.59 6 10 7.41 13.21 4.21 16 7 16 0 9 0"></polygon>
      <polygon points="6 8.59 2.79 11.79 0 9 0 16 7 16 4.21 13.21 7.41 10 6 8.59"></polygon>
    </g>
  </g>
</svg>
`);


const svgRotateIcon2 = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16.47 15.1">
  <g transform="rotate(180, 8.235, 7.55)"> <!-- 8.235 and 7.55 are half of 16.47 and 15.1 -->
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <path d="M14.3,2.17A8,8,0,0,1,3.09,13.42,7.84,7.84,0,0,1,1.68,12,8,8,0,0,1,2.31,1.48L3.73,2.89a6,6,0,0,0-.62,7.69,6.63,6.63,0,0,0,.65.77,5.73,5.73,0,0,0,.76.64A6,6,0,0,0,12.87,3.6L10.08,6.39,10,1.45,10,0h6.46Z"/>
      </g>
    </g>
  </g>
</svg>

`);
const layerIcon = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-layers-half" viewBox="0 0 16 16">
  <path d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4zM8 9.433 1.562 6 8 2.567 14.438 6 8 9.433z"></path>
</svg>
`);

const deletee = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
  <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
</svg>
`);
const width = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <g transform="translate(4 4) rotate(45 8 8)" id="Layer_2" data-name="Layer 2">
    <g id="Layer_1-2" data-name="Layer 1">
      <polygon points="9 0 11.79 2.79 8.59 6 10 7.41 13.21 4.21 16 7 16 0 9 0"></polygon>
      <polygon points="6 8.59 2.79 11.79 0 9 0 16 7 16 4.21 13.21 7.41 10 6 8.59"></polygon>
    </g>
  </g>
</svg>
`);
const height = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <g transform="translate(4 4) rotate(-45 8 8)" id="Layer_2" data-name="Layer 2">
    <g id="Layer_1-2" data-name="Layer 1">
      <polygon points="9 0 11.79 2.79 8.59 6 10 7.41 13.21 4.21 16 7 16 0 9 0"></polygon>
      <polygon points="6 8.59 2.79 11.79 0 9 0 16 7 16 4.21 13.21 7.41 10 6 8.59"></polygon>
    </g>
  </g>
</svg>


`);
const resizeIcon = `data:image/svg+xml;charset=utf-8,${svgResizeIcon} `
const rotateIcon2 = `data:image/svg+xml;charset=utf-8,${svgRotateIcon2} `
const layerIconn = `data:image/svg+xml;charset=utf-8,${layerIcon} `
const deleteIconn = `data:image/svg+xml;charset=utf-8,${deletee} `
const widthIconn = `data:image/svg+xml;charset=utf-8,${width} `
const heightIconn = `data:image/svg+xml;charset=utf-8,${height} `






const icons = {

  delete:
    deleteIconn,
  // "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cline x1='20' y1='20' x2='44' y2='44' stroke='%23000' stroke-width='4'/%3E%3Cline x1='44' y1='20' x2='20' y2='44' stroke='%23000' stroke-width='4'/%3E%3C/svg%3E",
  // "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64' fill='none'%3E%3Ccircle cx='25' cy='25' r='25' fill='white'/%3E%3Cg clip-path='url(%23clip0_12_132)'%3E%3Cpath d='M28.3104 21.6953C28 21.6953 27.7484 21.9469 27.7484 22.2573V32.8802C27.7484 33.1905 28 33.4423 28.3104 33.4423C28.6209 33.4423 28.8725 33.1905 28.8725 32.8802V22.2573C28.8725 21.9469 28.6209 21.6953 28.3104 21.6953Z' fill='black'/%3E%3Cpath d='M21.6781 21.6953C21.3677 21.6953 21.1161 21.9469 21.1161 22.2573V32.8802C21.1161 33.1905 21.3677 33.4423 21.6781 33.4423C21.9886 33.4423 22.2402 33.1905 22.2402 32.8802V22.2573C22.2402 21.9469 21.9886 21.6953 21.6781 21.6953Z' fill='black'/%3E%3Cpath d='M16.8444 20.145V33.9929C16.8444 34.8114 17.1446 35.5801 17.6689 36.1316C18.1908 36.6847 18.917 36.9986 19.6771 36.9999H30.3115C31.0718 36.9986 31.7981 36.6847 32.3197 36.1316C32.844 35.5801 33.1442 34.8114 33.1442 33.9929V20.145C34.1864 19.8683 34.8617 18.8615 34.7223 17.792C34.5827 16.7228 33.6718 15.9229 32.5933 15.9227H29.7156V15.2201C29.7189 14.6293 29.4853 14.062 29.067 13.6446C28.6488 13.2275 28.0806 12.9952 27.4898 13H22.4988C21.908 12.9952 21.3398 13.2275 20.9216 13.6446C20.5033 14.062 20.2697 14.6293 20.273 15.2201V15.9227H17.3953C16.3169 15.9229 15.4059 16.7228 15.2663 17.792C15.1269 18.8615 15.8022 19.8683 16.8444 20.145ZM30.3115 35.8758H19.6771C18.7161 35.8758 17.9686 35.0503 17.9686 33.9929V20.1944H32.02V33.9929C32.02 35.0503 31.2725 35.8758 30.3115 35.8758ZM21.3971 15.2201C21.3934 14.9275 21.5084 14.6458 21.7161 14.4392C21.9236 14.2326 22.206 14.1191 22.4988 14.1241H27.4898C27.7826 14.1191 28.065 14.2326 28.2725 14.4392C28.4802 14.6456 28.5952 14.9275 28.5915 15.2201V15.9227H21.3971V15.2201ZM17.3953 17.0468H32.5933C33.1521 17.0468 33.605 17.4998 33.605 18.0585C33.605 18.6173 33.1521 19.0703 32.5933 19.0703H17.3953C16.8365 19.0703 16.3836 18.6173 16.3836 18.0585C16.3836 17.4998 16.8365 17.0468 17.3953 17.0468Z' fill='black'/%3E%3Cpath d='M24.9943 21.6953C24.6839 21.6953 24.4323 21.9469 24.4323 22.2573V32.8802C24.4323 33.1905 24.6839 33.4423 24.9943 33.4423C25.3048 33.4423 25.5564 33.1905 25.5564 32.8802V22.2573C25.5564 21.9469 25.3048 21.6953 24.9943 21.6953Z' fill='black'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_12_132'%3E%3Crect width='24' height='24' fill='white' transform='translate(13 13)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E",
  rotate:
    rotateIcon2,
  // "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' cx='32' cy='32' r='32'/%3E%3Cpath fill='%23000' d='M32 12a20 20 0 1 1-14.14 5.86l3.54 3.54A16 16 0 1 0 32 16v6l8-8-8-8v6z'/%3E%3C/svg%3E",

  // "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpath fill='%23000' d='M32 12a20 20 0 1 1-14.14 5.86l3.54 3.54A16 16 0 1 0 32 16v6l8-8-8-8v6z'/%3E%3C/svg%3E",

  resize:
    resizeIcon,
  // "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik00NCA0NEgzNnY0aDh2LThoLTRaTTIwIDIwaDh2LTRoLTh2OGg0WiIvPjwvc3ZnPg==",

  // "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpath fill='%23000' d='M20 20h4v-4h-8v8h4v-4zm20 20h-4v4h8v-8h-4v4z'/%3E%3C/svg%3E",

  layer:
    layerIconn,
  // "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpath fill='%23000' d='M32 16l16 8-16 8-16-8 16-8zm0 20l16-8v4l-16 8-16-8v-4l16 8zm0 8l16-8v4l-16 8-16-8v-4l16 8z'/%3E%3C/svg%3E",

  width:
widthIconn,
    // "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpath stroke='%23000' stroke-width='2' fill='none' d='M16 32h32M20 28l-8 4 8 4M44 28l8 4-8 4'/%3E%3C/svg%3E",

  height:
  heightIconn,
    // "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpath stroke='%23000' stroke-width='2' fill='none' d='M32 16v32M28 20l4-8 4 8M28 44l4 8 4-8'/%3E%3C/svg%3E",

  layerUp:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpolygon fill='%23000' points='32,16 24,28 40,28'/%3E%3C/svg%3E",

  layerDown:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpolygon fill='%23000' points='32,48 24,36 40,36'/%3E%3C/svg%3E",

  layerTop:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpolygon fill='%23000' points='32,12 24,24 40,24'/%3E%3C/svg%3E",

  layerBottom:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' stroke='%23000' stroke-width='2' cx='32' cy='32' r='30'/%3E%3Cpolygon fill='%23000' points='32,52 24,40 40,40'/%3E%3C/svg%3E",

};


export default icons;
