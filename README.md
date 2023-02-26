# Grafkom-WebGL

Pada tugas 1 dari mata kuliah IF3260, kami membangun program dengan kakas WebGL untuk membangun program sederhana yang berfungsi menggambar model-model geometri serta mengaplikasikan berbagai modifikasi terhadap model-model tersebut. Program ini tidak menggunakan library eksternal. Kami membangun sendiri semua fungsi-fungsi primitif yang dibutuhkan untuk membangun program yang tidak disediakan oleh WebGL.

Kelompok:
| Nama | Nim |
| :----------------------------: | :------: |
| Reinaldo Antolis | 13519015 |
| Vionie Novencia Thanggestyo | 13520006 |
| Muhammad Garebaldhie ER Rahman | 13520029 |

## Cara Menjalankan Program

1. Clone Repository
2. Double click pada index.html
3. Tekan tombol help yang ada pada bagian kanan atas
4. Pilih model yang mau digambar
5. Klik canvas untuk menggambar
6. Pilih objek yang ingin diedit
7. Klik tombol edit
8. Pilih fitur edit yang diinginkan
9. Lakukan pengeditan sesuai jenis fitur edit
10. Klik tombol save untuk menyimpan model
11. Klik tombol load untuk memuat model dari file eksternal

Manual untuk menjalankan program secara selengkapnya terdapat di folder doc, file laporan

## Fungsi-Fungsi Non-Primitive WebGL yang Dibuat

- getMouse Position
  Mendapatkan posisi mouse pada canvas

- getRGB
  Mendapatkan enkoding RGB dari color selector

- resizeCanvas
  Mengatur ulang ukuran canvas

- transformCoordinate
  Merubah koordinat layar menjadi koordinat clip (web gl)

- loadShader
  Fungsi yang digunakan untuk meload shader webgl

- createShaderProgram
  Membuat program yang berisi shader yang telah dibuat, nantinya program ini akan digunakan untuk proses rendering

- render
  Fungsi ini akan merender object menggunakan program yang telah dibuat.

## Implemented Features

1. Draw Line
2. Draw Rectangle
3. Draw Square
4. Draw Polygon
5. Polygon by convex hull
6. Geometric transofrmation
   1. Dilatation
   2. Translation
   3. Rotation
   4. Shear
7. Save / load models

## Folder Structure

```md
│ README.md
│
├───doc
├───src
│ │ feature.js
│ │ index.css
│ │ index.html
│ │ main.js
│ │ model.js
│ │ util.js
│ │
│ └───assets
│ dotted-polygon.png
│ help.png
│ line.png
│ polygon.png
│ rectangle.png
│ save.png
│ square.png
│
└───test
.gitkeep
save.json
save_2.json
```
