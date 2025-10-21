// ===================================
// GRCKOBI V3.0 - Site Scripts
// Dark Mode (Koyu Mod) Yönetimi
// ===================================

// AŞAMA 1: Sayfa Yüklenirken Tema Kontrolü (Flaş Önleme)
// Bu kod bloğu, DOM tamamen yüklenmeden önce çalışır
(function() {
    // localStorage'dan kayıtlı tema tercihini al
    const savedTheme = localStorage.getItem('theme');
    
    // Eğer daha önce 'dark' seçilmişse, hemen uygula
    if (savedTheme === 'dark') {
        // Body elementine dark-mode sınıfını ekle
        // Bu sayede sayfa yüklenirken beyaz flaş görünmez
        document.documentElement.classList.add('dark-mode-loading');
        
        // Body elementi hazır olur olmaz dark-mode sınıfını ekle
        if (document.body) {
            document.body.classList.add('dark-mode');
        } else {
            // Body henüz yüklenmediyse, yüklendiğinde ekle
            document.addEventListener('DOMContentLoaded', function() {
                document.body.classList.add('dark-mode');
            });
        }
    }
})();

// AŞAMA 2: Sayfa Tamamen Yüklendiğinde Çalışacak Ana Kod
document.addEventListener('DOMContentLoaded', function() {
    
    // Dark Mode Toggle Fonksiyonu
    function toggleDarkMode() {
        // Body elementini al
        const body = document.body;
        
        // Dark mode sınıfını değiştir (toggle)
        body.classList.toggle('dark-mode');
        
        // Mevcut durumu kontrol et
        const isDarkMode = body.classList.contains('dark-mode');
        
        // Yeni tema durumunu belirle
        const newTheme = isDarkMode ? 'dark' : 'light';
        
        // localStorage'a kaydet
        localStorage.setItem('theme', newTheme);
        
        // Konsola bilgi yaz (debug için)
        console.log(`Tema değiştirildi: ${newTheme}`);
        
        // Tema değişimi olayını tetikle (diğer scriptler dinleyebilir)
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: newTheme } 
        }));
    }
    
    // Theme Toggle Butonunu Bul ve Dinle
    const themeToggleButton = document.getElementById('theme-toggle-button');
    
    if (themeToggleButton) {
        // Butona tıklama olayını dinle
        themeToggleButton.addEventListener('click', toggleDarkMode);
        
        // Buton içeriğini güncelle (opsiyonel)
        updateButtonContent(themeToggleButton);
        
        // Tema değiştiğinde buton içeriğini güncelle
        window.addEventListener('themeChanged', function() {
            updateButtonContent(themeToggleButton);
        });
    } else {
        // Eğer buton bulunamazsa konsola uyarı yaz
        console.warn('Theme toggle button (#theme-toggle-button) bulunamadı!');
    }
    
    // Yardımcı Fonksiyon: Buton İçeriğini Güncelle
    function updateButtonContent(button) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        // Buton içeriğini tema durumuna göre değiştir
        // Emoji veya ikon kullanabilirsiniz
        button.innerHTML = isDarkMode ? '☀️' : '🌙';
        button.setAttribute('aria-label', isDarkMode ? 'Açık temaya geç' : 'Koyu temaya geç');
        button.setAttribute('title', isDarkMode ? 'Açık temaya geç' : 'Koyu temaya geç');
    }
    
    // İlk Yükleme Kontrolü (Güvenlik için)
    // localStorage'da tema yoksa varsayılan olarak 'light' kaydet
    if (!localStorage.getItem('theme')) {
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    }
    
    // Temizlik: Geçici sınıfı kaldır
    document.documentElement.classList.remove('dark-mode-loading');
    
});

// BONUS: Klavye Kısayolu (Ctrl/Cmd + Shift + D)
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Shift + D kombinasyonunu kontrol et
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        
        // Toggle butonunu bul ve tıklama olayını tetikle
        const button = document.getElementById('theme-toggle-button');
        if (button) {
            button.click();
        }
    }
});

// BONUS: Sistem Tema Tercihini Dinle (Opsiyonel)
// Kullanıcının işletim sistemi tema tercihini algıla
if (window.matchMedia) {
    // Sistem koyu mod tercihini kontrol et
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // İlk yüklemede, eğer localStorage'da tema yoksa sistem tercihini kullan
    if (!localStorage.getItem('theme') && systemPrefersDark.matches) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    }
    
    // Sistem tercihi değiştiğinde dinle (opsiyonel)
    systemPrefersDark.addEventListener('change', function(e) {
        // Sadece kullanıcı manuel olarak tema seçmemişse uygula
        if (!localStorage.getItem('userSetTheme')) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
            
            // Buton içeriğini güncelle
            const button = document.getElementById('theme-toggle-button');
            if (button && window.updateButtonContent) {
                updateButtonContent(button);
            }
        }
    });
}

// Debug Fonksiyonu: Mevcut Tema Durumunu Konsola Yaz
window.getCurrentTheme = function() {
    const theme = localStorage.getItem('theme') || 'light';
    const isDarkMode = document.body.classList.contains('dark-mode');
    console.log(`LocalStorage tema: ${theme}`);
    console.log(`Body dark-mode sınıfı: ${isDarkMode ? 'var' : 'yok'}`);
    return theme;
};

// Tema Değişimini Manuel Olarak Tetikleme Fonksiyonu
window.setTheme = function(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
    
    // Buton içeriğini güncelle
    const button = document.getElementById('theme-toggle-button');
    if (button && window.updateButtonContent) {
        updateButtonContent(button);
    }
    
    console.log(`Tema manuel olarak değiştirildi: ${theme}`);
};

// ===================================
// Header Scroll Efekti (Opsiyonel) - EKLENDİ
// ===================================
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
// V3.5 - Welcome Bubble Akıllı Mantık
document.addEventListener('DOMContentLoaded', function() {
    // Welcome bubble elementini seç
    const welcomeBubble = document.querySelector('.welcome-bubble');
    
    if (!welcomeBubble) return; // Eğer element yoksa çık
    
    // LocalStorage'dan kullanıcının daha önce baloncuğu kapatıp kapatmadığını kontrol et
    const isBubbleClosed = localStorage.getItem('welcomeBubbleClosed') === 'true';
    
    // Mevcut sayfanın ana sayfa olup olmadığını kontrol et
    const currentPath = window.location.pathname;
    const isHomePage = currentPath === '/' || 
                      currentPath === '/index.html' || 
                      currentPath.endsWith('/index.html') ||
                      currentPath === '' ||
                      (currentPath.split('/').pop() === '' || currentPath.split('/').pop() === 'index.html');
    
    // Baloncuk gösterme mantığı
    if (!isBubbleClosed && isHomePage) {
        // Ana sayfada ve daha önce kapatılmamışsa göster
        welcomeBubble.style.display = 'block';
    } else {
        // Diğer tüm durumlarda gizle
        welcomeBubble.style.display = 'none';
    }
    
    // Kapatma butonu olayını ekle
    const closeBtn = welcomeBubble.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            // Baloncuğu gizle
            welcomeBubble.style.display = 'none';
            
            // Kullanıcının tercihini localStorage'a kaydet
            localStorage.setItem('welcomeBubbleClosed', 'true');
            
            console.log('Welcome bubble kapatıldı ve tercih kaydedildi.');
        });
    }
});
