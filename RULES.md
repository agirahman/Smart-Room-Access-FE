pastikan tidak menggunakan type: any saat fetch data, buat type yang sesuai

Gunakan app router, buat app bersih hanya berisi routing

isi dari app router ada di components/(nama directory)

buat componen reusable di /components

buat component/section halaman yang digunakan di halaman tersentu masukkan ke /components/(nama directory)/NamaComponent.tsx

file index.tsx digunakan untuk memanggil component/section halaman yang digunakan

jangan fetch data di client component (halaman) tapi fetch di server component

gunakan server action atau server component untuk fetch data

hanya gunakan apiClient.ts di client component (halaman) untuk melakukan aksi (login, logout, dll) atau mutasi data

untuk halaman yang memerlukan data dari API, fetch data di server component