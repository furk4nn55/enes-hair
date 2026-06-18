// HTML elemanlarımızı JavaScript tarafında seçiyoruz
const form = document.getElementById('appointmentForm');
const tarihInput = document.getElementById('tarihSecimi');
const saatSelect = document.getElementById('saatSecimi');

// Müşteri tarihi her değiştirdiğinde dolu saatleri kontrol eden fonksiyonu çalıştır
tarihInput.addEventListener('change', doluSaatleriKontrolEt);

function doluSaatleriKontrolEt() {
    const secilenTarih = tarihInput.value;
    if (!secilenTarih) return;

    // Her tarih değişiminde önce tüm saatleri aktif yapıp "(DOLU)" yazılarını temizliyoruz
    Array.from(saatSelect.options).forEach(option => {
        if (option.value !== "") {
            option.disabled = false;
            option.text = option.value; 
        }
    });

    // Tarayıcının yerel hafızasından (LocalStorage) kayıtlı randevuları çekiyoruz
    const mevcutRandevular = JSON.parse(localStorage.getItem('randevular')) || [];

    // Seçilen tarihte daha önce alınmış saatleri filtreliyoruz
    const doluSaatler = mevcutRandevular
        .filter(randevu => randevu.tarih === secilenTarih)
        .map(randevu => randevu.saat);

    // Eğer o saat kapılmışsa, seçenekte devre dışı (disabled) bırakıyoruz ve yanına DOLU yazıyoruz
    Array.from(saatSelect.options).forEach(option => {
        if (doluSaatler.includes(option.value)) {
            option.disabled = true;
            option.text = option.value + " (DOLU)";
        }
    });
}

// "Randevuyu Onayla" butonuna basıldığında çalışacak kısım
form.addEventListener('submit', function(event) {
    // Sayfanın kendi kendine yenilenmesini engelliyoruz
    event.preventDefault();

    const ustaSelect = form.querySelectorAll('select')[0];
    const hizmetSelect = form.querySelectorAll('select')[1];
    const isimInput = form.querySelector('input[type="text"]');
    const telInput = form.querySelector('input[type="tel"]');

    // Müşterinin girdiği verileri bir paket haline getiriyoruz
    const yeniRandevu = {
        tarih: tarihInput.value,
        saat: saatSelect.value,
        isim: isimInput.value,
        telefon: telInput.value,
        usta: ustaSelect.value,
        hizmet: hizmetSelect.value
    };

    // Basit bir boş alan kontrolü
    if (!yeniRandevu.tarih || !yeniRandevu.saat || !yeniRandevu.isim || !yeniRandevu.telefon) {
        alert("Lütfen tüm alanları doldurun!");
        return;
    }

    // Yeni randevuyu hafızadaki eski randevuların yanına ekleyip tekrar kaydediyoruz
    const mevcutRandevular = JSON.parse(localStorage.getItem('randevular')) || [];
    mevcutRandevular.push(yeniRandevu);
    localStorage.setItem('randevular', JSON.stringify(mevcutRandevular));

    // Kullanıcıya şık bir bilgilendirme mesajı veriyoruz
    alert(`Teşekkürler ${yeniRandevu.isim}! Randevunuz ${yeniRandevu.tarih} günü saat ${yeniRandevu.saat} için başarıyla alındı.`);
    
    // Formu temizle ve saat listesini güncel tut
    form.reset();
    doluSaatleriKontrolEt();
});