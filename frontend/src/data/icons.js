const icons = {
    delete:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='31' fill='%23fff' stroke='%23ccc' stroke-width='2'/%3E%3Cpath fill='%23666' d='M24 20v-2a2 2 0 012-2h12a2 2 0 012 2v2h8v4H16v-4h8zm2 0h12v-2H26v2zm-4 6h20l-2 24H24l-2-24z'/%3E%3C/svg%3E",
    rotate:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle fill='%23FFFFFF' cx='32' cy='32' r='32'/%3E%3Cpath fill='%23666666' d='M32 12a20 20 0 1 1-14.14 5.86l3.54 3.54A16 16 0 1 0 32 16v6l8-8-8-8v6z'/%3E%3C/svg%3E",
    resize:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik00NCA0NEgzNnY0aDh2LThoLTRaTTIwIDIwaDh2LTRoLTh2OGg0WiIvPjwvc3ZnPg==",
    layer:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48Y2lyY2xlIGN4PSIzMiIgY3k9IjMyIiByPSIzMiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGZpbGw9IiM2NjYiIGQ9Ik0xNiAzNmwxNiAxMCAxNi0xMC0xNi0xMC0xNiAxMHptMC02bDE2LTEwIDE2IDEwLTE2IDEwLTE2LTEweiIvPjwvc3ZnPg==",
    width:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjkiIGhlaWdodD0iMjciIHZpZXdCb3g9IjAgMCAyOSAyNyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjkiIGhlaWdodD0iMjciIGZpbGw9IndoaXRlIi8+CiAgPHJlY3QgeD0iMSIgeT0iMSIgd2lkdGg9IjI3IiBoZWlnaHQ9IjI1IiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxwb2x5Z29uIHBvaW50cz0iNSwxMy41IDExLDkgMTEsMTgiIGZpbGw9IiMzMzMiLz4KICA8cG9seWdvbiBwb2ludHM9IjI0LDEzLjUgMTgsOSAxOCwxOCIgc3Ryb2tlPSJub25lIiBmaWxsPSIjMzMzIi8+Cjwvc3ZnPg==",
    height: 
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjciIGhlaWdodD0iMjkiIHZpZXdCb3g9IjAgMCAyNyAyOSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjciIGhlaWdodD0iMjkiIGZpbGw9IndoaXRlIi8+CiAgPHJlY3QgeD0iMSIgeT0iMSIgd2lkdGg9IjI1IiBoZWlnaHQ9IjI3IiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxwb2x5Z29uIHBvaW50cz0iMTMuNSw1IDksMTEgMTgsMTEiIGZpbGw9IiMzMzMiLz4KICA8cG9seWdvbiBwb2ludHM9IjEzLjUsMjQgOSwxOCAxOCwxOCIgc3Ryb2tlPSJub25lIiBmaWxsPSIjMzMzIi8+Cjwvc3ZnPg==",
    layerUp: 
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjciIGhlaWdodD0iMjkiIHZpZXdCb3g9IjAgMCAyNyAyOSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjciIGhlaWdodD0iMjkiIGZpbGw9IndoaXRlIi8+CiAgPHJlY3QgeD0iMSIgeT0iMSIgd2lkdGg9IjI1IiBoZWlnaHQ9IjI3IiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxwb2x5Z29uIHBvaW50cz0iMTMuNSw1IDksMTEgMTgsMTEiIGZpbGw9IiMzMzMiLz4KICA8cG9seWdvbiBwb2ludHM9IjEzLjUsMjQgOSwxOCAxOCwxOCIgc3Ryb2tlPSJub25lIiBmaWxsPSIjMzMzIi8+Cjwvc3ZnPg==",
    layerDown: 
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjciIGhlaWdodD0iMjkiIHZpZXdCb3g9IjAgMCAyNyAyOSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjciIGhlaWdodD0iMjkiIGZpbGw9IndoaXRlIi8+CiAgPHJlY3QgeD0iMSIgeT0iMSIgd2lkdGg9IjI1IiBoZWlnaHQ9IjI3IiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxwb2x5Z29uIHBvaW50cz0iMTMuNSw1IDksMTEgMTgsMTEiIGZpbGw9IiMzMzMiLz4KICA8cG9seWdvbiBwb2ludHM9IjEzLjUsMjQgOSwxOCAxOCwxOCIgc3Ryb2tlPSJub25lIiBmaWxsPSIjMzMzIi8+Cjwvc3ZnPg==",
    layerTop: 
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjciIGhlaWdodD0iMjkiIHZpZXdCb3g9IjAgMCAyNyAyOSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjciIGhlaWdodD0iMjkiIGZpbGw9IndoaXRlIi8+CiAgPHJlY3QgeD0iMSIgeT0iMSIgd2lkdGg9IjI1IiBoZWlnaHQ9IjI3IiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMSIvPgogIDxwb2x5Z29uIHBvaW50cz0iMTMuNSw1IDksMTEgMTgsMTEiIGZpbGw9IiMzMzMiLz4KICA8cG9seWdvbiBwb2ludHM9IjEzLjUsMjQgOSwxOCAxOCwxOCIgc3Ryb2tlPSJub25lIiBmaWxsPSIjMzMzIi8+Cjwvc3ZnPg==",
    layerBottom: 
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTxK-El1cTfP3hI5Jd71MaTAoH-ryKzZWVNw&s",
};

export default icons;