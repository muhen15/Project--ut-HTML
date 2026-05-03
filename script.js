// ================= DATA GLOBAL =================
let dataHistori = [];
let editIndex = -1;


// ================= LOAD DATA BAHAN AJAR =================
function loadData() {
    const cardGrid = document.getElementById("cardGrid");
    if (!cardGrid) return;

    let html = "";

    dataBahanAjar.forEach((item, index) => {
        html += `
        <div class="card" onclick="showDetail(${index})">

            <img src="${item.cover}" onerror="this.src='assets/img/default.jpg'">

            <div class="card-body">
                <h3>${item.namaBarang}</h3>

                <div class="badge-jenis">
                    ${item.jenisBarang}
                </div>

                <div class="deskripsi">
                    <p><b>Kode Barang:</b> ${item.kodeBarang}</p>
                    <p><b>Kode Lokasi:</b> ${item.kodeLokasi}</p>
                    <p><b>Edisi:</b> ${item.edisi}</p>
                    <p><b>Stok:</b> ${item.stok}</p>
                </div>

                <button onclick="event.stopPropagation(); editData(${index})">Edit</button>
                <button onclick="event.stopPropagation(); hapusData(${index})">Hapus</button>

            </div>
        </div>
        `;
    });

    cardGrid.innerHTML = html;

    document.getElementById("totalStok").innerText =
        dataBahanAjar.reduce((t, i) => t + parseInt(i.stok || 0), 0);

    document.getElementById("totalJenis").innerText = dataBahanAjar.length;
}


// ================= DETAIL =================
function showDetail(index) {
    let item = dataBahanAjar[index];

    document.getElementById("modalDetail").style.display = "block";
    document.getElementById("modalBody").innerHTML = `
        <h3>${item.namaBarang}</h3>
        <p><b>Jenis:</b> ${item.jenisBarang}</p>
        <p><b>Edisi:</b> ${item.edisi}</p>
        <p><b>Kode Barang:</b> ${item.kodeBarang}</p>
        <p><b>Kode Lokasi:</b> ${item.kodeLokasi}</p>
        <p><b>Stok:</b> ${item.stok}</p>
    `;
}


// ================= TAMBAH + EDIT DATA =================
function tambahData() {

    let nama = document.getElementById("nama").value;
    let stok = document.getElementById("stok").value;
    let kodeBarang = document.getElementById("kode").value;
    let kodeLokasi = document.getElementById("lokasi").value;
    let edisi = document.getElementById("edisi").value;
    let jenis = document.getElementById("jenis").value;

    let file = document.getElementById("cover").files[0];

    if (!nama || !stok) {
        alert("Nama dan stok wajib diisi!");
        return;
    }

    let cover = file ? URL.createObjectURL(file) : "assets/img/default.jpg";

    let dataBaru = {
        kodeLokasi,
        kodeBarang,
        namaBarang: nama,
        jenisBarang: jenis,
        edisi,
        stok,
        cover
    };

    // ================= MODE EDIT =================
    if (editIndex >= 0) {

        dataBahanAjar[editIndex] = dataBaru;

        dataHistori.push({
            nama: nama,
            aktivitas: "Mengedit bahan ajar",
            waktu: new Date().toLocaleString("id-ID")
        });

        editIndex = -1;
        alert("Data berhasil diupdate");

    } else {

        dataBahanAjar.push(dataBaru);

        dataHistori.push({
            nama: nama,
            aktivitas: "Menambahkan bahan ajar",
            waktu: new Date().toLocaleString("id-ID")
        });

        alert("Data berhasil ditambahkan");
    }

    loadData();
    loadHistori();

    // reset form
    document.getElementById("nama").value = "";
    document.getElementById("stok").value = "";
    document.getElementById("kode").value = "";
    document.getElementById("lokasi").value = "";
    document.getElementById("edisi").value = "";
    document.getElementById("cover").value = "";
}


// ================= EDIT DATA =================
function editData(index) {
    let item = dataBahanAjar[index];

    document.getElementById("nama").value = item.namaBarang;
    document.getElementById("stok").value = item.stok;
    document.getElementById("kode").value = item.kodeBarang;
    document.getElementById("lokasi").value = item.kodeLokasi;
    document.getElementById("edisi").value = item.edisi;
    document.getElementById("jenis").value = item.jenisBarang;

    editIndex = index;
}


// ================= HAPUS DATA =================
function hapusData(index) {

    let nama = dataBahanAjar[index].namaBarang;

    dataBahanAjar.splice(index, 1);

    dataHistori.push({
        nama: nama,
        aktivitas: "Menghapus bahan ajar",
        waktu: new Date().toLocaleString("id-ID")
    });

    loadData();
    loadHistori();
}


// ================= HISTORI =================
function loadHistori() {
    let tbody = document.getElementById("tabelHistori");
    if (!tbody) return;

    let html = "";

    dataHistori.forEach((item, index) => {
        html += `
        <tr>
            <td>${index + 1}</td>
            <td>${item.nama}</td>
            <td>${item.aktivitas}</td>
            <td>${item.waktu}</td>
        </tr>
        `;
    });

    tbody.innerHTML = html;
}


// ================= MENU =================
function hideAll() {
    document.getElementById("welcomeSection").style.display = "none";
    document.getElementById("bahanAjarSection").style.display = "none";
    document.getElementById("laporanSection").style.display = "none";
    document.getElementById("historiSection").style.display = "none";
}

function showWelcome() {
    hideAll();
    document.getElementById("welcomeSection").style.display = "block";
}

function showBahanAjar() {
    hideAll();
    document.getElementById("bahanAjarSection").style.display = "block";
    loadData();
}

function showLaporan() {
    hideAll();
    document.getElementById("laporanSection").style.display = "block";
}

function showHistori() {
    hideAll();
    document.getElementById("historiSection").style.display = "block";
    loadHistori();
}


// ================= MODAL =================
function closeModal() {
    document.getElementById("modalDetail").style.display = "none";
}


// ================= LOCAL STORAGE MENU =================
function setMenu(active) {
    localStorage.setItem("menuActive", active);
}


// ================= AUTO LOAD =================
window.onload = function () {
    let menu = localStorage.getItem("menuActive");

    hideAll();

    if (menu === "bahanAjar") showBahanAjar();
    else if (menu === "laporan") showLaporan();
    else showWelcome();
};