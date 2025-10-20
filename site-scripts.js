/* ===================================
   GRC KOBİ V3.0 - Site Scripts
   Dark Mode Toggle & Theme Management
   =================================== */

// DOM tamamen yüklendikten sonra scripti çalıştır
document.addEventListener('DOMContentLoaded', function() {
    
    /* ===================================
       TEMA YÖNETİMİ DEĞİŞKENLERİ
       =================================== */
    
    // Tema butonunu ve ikonları tanımla
    let themeToggleButton;
    const sunIcon = '☀️';
    const moonIcon = '🌙';
    
    /* ===================================
       TEMA BUTONU OLUŞTURMA
       =================================== */
    
    // Yeni buton elementi oluştur
    themeToggleButton = document.createElement('button');
    
    // Butona CSS sınıfı ekle
    themeToggleButton.className = 'theme-toggle-button';
    
    // Buton içine ikon için span elementi oluştur
    const iconSpan = document.createElement('span');
    iconSpan.className = 'theme-icon';
    
    // Span'i butona ekle
    themeToggleButton.appendChild(iconSpan);
    
    // Header içindeki nav elementini bul
    const navElement = document.querySelector('header nav ul');
    
    // Eğer nav elementi varsa, butonu ekle
    if (navElement) {
        // Butonu bir li elementi içine sarmalayalım (menü uyumluluğu için)
        const buttonWrapper = document.createElement('li');
        buttonWrapper.appendChild(themeToggleButton);
        
        // Nav menüsünün sonuna ekle
        navElement.appendChild(buttonWrapper);
    } else {
        // Eğer nav bulunamazsa, direkt header'a ekle
        const headerElement = document.querySelector('header');
        if (headerElement) {
            headerElement.appendChild(themeToggleButton);
        }
    }
    
    /* ===================================
       HAFIZA (localStorage) KONTROLÜ
       =================================== */
    
    // Kullanıcının daha önce seçtiği temayı kontrol et
    const savedTheme = localStorage.getItem('theme');
    const iconElement = themeToggleButton.querySelector('.theme-icon');
    
    // Kaydedilmiş tema varsa uygula
    if (savedTheme === 'dark') {
        // Koyu mod aktif
        document.body.classList.add('dark-mode');
        iconElement.textContent = moonIcon;
    } else {
        // Açık mod aktif (varsayılan)
        document.body.classList.remove('dark-mode');
        iconElement.textContent = sunIcon;
    }
    
    /* ===================================
       TEMA DEĞİŞTİRME FONKSİYONU
       =================================== */
    
    function toggleTheme() {
        // Body'ye dark-mode sınıfını ekle/kaldır
        const isDarkMode = document.body.classList.toggle('dark-mode');
        
        // İkonu güncelle
        iconElement.textContent = isDarkMode ? moonIcon : sunIcon;
        
        // Tema tercihini localStorage'a kaydet
        if (isDarkMode) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        
        // Konsola log at (debug için)
        console.log('Tema değiştirildi:', isDarkMode ? 'Koyu Mod' : 'Açık Mod');
    }
    
    /* ===================================
       BUTONA TIKLANMA OLAYI
       =================================== */
    
    // Tema butonuna click event listener ekle
    themeToggleButton.addEventListener('click', toggleTheme);
    
    /* ===================================
       KLAVYE ERİŞİLEBİLİRLİĞİ
       =================================== */
    
    // Enter veya Space tuşlarıyla da tema değiştirilebilsin
    themeToggleButton.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleTheme();
        }
    });
    
    // Butona erişilebilirlik özellikleri ekle
    themeToggleButton.setAttribute('aria-label', 'Tema değiştir');
    themeToggleButton.setAttribute('title', 'Koyu/Açık mod değiştir');
    
    /* ===================================
       BONUS: GEÇİŞ ANİMASYONU
       =================================== */
    
    // Tema değişimlerinde yumuşak geçiş için
    const style = document.createElement('style');
    style.textContent = `
        body {
            transition: background-color 0.3s ease, color 0.3s ease;
        }
        * {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    /* ===================================
       İLK YÜKLEME MESAJI
       =================================== */
    
    // Konsola başarılı yükleme mesajı
    console.log('GRCKobi V3.0 Site Scripts başarıyla yüklendi!');
    console.log('Mevcut tema:', savedTheme || 'light');
});

/* ===================================
   YARDIMCI FONKSİYONLAR
   =================================== */

// Tema durumunu kontrol eden yardımcı fonksiyon
function isDarkModeActive() {
    return document.body.classList.contains('dark-mode');
}

// Tema durumunu dışarıdan sorgulayabilmek için global scope'a ekle
window.isDarkModeActive = isDarkModeActive;
