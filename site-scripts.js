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
// ===== GRCKOBI V3.5 - JAVASCRIPT BRAIN UPDATE =====

// 1. Hoş Geldiniz Baloncuğu Mantığı
document.addEventListener('DOMContentLoaded', function() {
    const welcomeBubble = document.querySelector('.welcome-bubble');
    
    if (welcomeBubble) {
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
            welcomeBubble.style.display = 'block';
        } else {
            welcomeBubble.style.display = 'none';
        }
        
        // Kapatma butonu olayını ekle
        const closeBtn = welcomeBubble.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                welcomeBubble.style.display = 'none';
                localStorage.setItem('welcomeBubbleClosed', 'true');
                console.log('Welcome bubble kapatıldı ve tercih kaydedildi.');
            });
        }
    }
});

// 2. Açık Tema Varsayılanı
document.addEventListener('DOMContentLoaded', function() {
    // Sayfa yüklenirken tema kontrolü
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    
    // Eğer kaydedilmiş tema 'dark' değilse, dark-mode sınıfını kaldır (varsayılan açık tema)
    if (savedTheme !== 'dark') {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light'); // Açık temayı kaydet
    } else {
        // Eğer dark tema kaydedilmişse, dark-mode sınıfını ekle
        body.classList.add('dark-mode');
    }
});

// 3. "Yukarı Çık" (Scroll to Top) Butonu Mantığı
document.addEventListener('DOMContentLoaded', function() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    if (scrollTopBtn) {
        // Başlangıçta butonu gizle
        scrollTopBtn.style.display = 'none';
        
        // Scroll olayını dinle
        window.onscroll = function() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                // 20px'ten fazla kaydırıldığında butonu göster
                scrollTopBtn.style.display = 'block';
            } else {
                // En üstte veya 20px'ten az kaydırıldığında butonu gizle
                scrollTopBtn.style.display = 'none';
            }
        };
        
        // Butona tıklandığında yumuşak kaydırma ile en üste çık
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// ===== V3.5 BRAIN UPDATE TAMAMLANDI =====
// ===== İNTERAKTİF RİSK TESTİ - V3.5 =====
document.addEventListener('DOMContentLoaded', function() {
    const riskTestForm = document.getElementById('riskTestForm');
    const testResults = document.getElementById('test-results');

    if (riskTestForm) {
        riskTestForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Tüm soruların cevaplanıp cevaplanmadığını kontrol et
            let totalQuestions = 15;
            let answeredQuestions = 0;
            let totalScore = 0;

            for (let i = 1; i <= totalQuestions; i++) {
                const question = document.querySelector(`input[name="q${i}"]:checked`);
                if (question) {
                    answeredQuestions++;
                    totalScore += parseInt(question.value);
                }
            }

            // Eksik cevap kontrolü
            if (answeredQuestions < totalQuestions) {
                alert(`Lütfen tüm soruları cevaplayınız. ${totalQuestions - answeredQuestions} soru cevaplanmamış.`);
                return;
            }

            // Yüzdelik skor hesapla (maksimum puan 30)
            const maxScore = 30;
            const percentageScore = Math.round((totalScore / maxScore) * 100);

            // Risk seviyesi belirleme
            let riskLevel, riskClass, riskTitle, riskDescription, riskRecommendation;

            if (percentageScore >= 75) {
                // Düşük Risk
                riskLevel = "Düşük Risk";
                riskClass = "low-risk";
                riskTitle = "🎉 Harika! Güçlü Bir Temel";
                riskDescription = "Tebrikler! GRC ve KVKK konularında sağlam bir temeliniz var. İşletmeniz bu alanlarda oldukça iyi durumda ve temel uyumluluk gereksinimlerinin çoğunu karşılıyor.";
                riskRecommendation = "💡 <strong>Önerimiz:</strong> Mevcut sistemlerinizi düzenli olarak gözden geçirmeye ve güncel tutmaya devam edin. Çalışan eğitimlerini periyodik olarak tekrarlayın.";
            } else if (percentageScore >= 40) {
                // Orta Risk
                riskLevel = "Orta Risk";
                riskClass = "medium-risk";
                riskTitle = "⚠️ İyi Bir Başlangıç, Ama...";
                riskDescription = "İyi bir başlangıç yapmışsınız ancak iyileştirilmesi gereken önemli alanlar bulunuyor. Bazı temel GRC ve KVKK gereksinimlerini karşılıyorsunuz, ancak daha kapsamlı bir yaklaşım gerekli.";
                riskRecommendation = "💡 <strong>Önerimiz:</strong> 'Kısmen' veya 'Bilmiyorum' cevabı verdiğiniz alanlara odaklanın. Bu konularda uzman desteği almanızı öneririz.";
            } else {
                // Yüksek Risk
                riskLevel = "Yüksek Risk";
                riskClass = "high-risk";
                riskTitle = "🚨 Dikkat! Acil Eylem Gerekli";
                riskDescription = "Dikkat! İşletmeniz GRC ve KVKK açısından önemli riskler altında olabilir. 'Hayır' cevabı verdiğiniz konulara acilen odaklanmalısınız. Mevcut durumunuz yasal yükümlülükleri ve güvenlik gereksinimlerini karşılamamakta.";
                riskRecommendation = "💡 <strong>Önerimiz:</strong> Derhal uzman destek alın ve öncelikli eylem planı oluşturun. KVKK uyumluluğu ve temel güvenlik önlemleri için hızlıca hareket edin.";
            }

            // Sonuçları HTML'e yaz
            testResults.innerHTML = `
                <div class="result-score">${percentageScore}%</div>
                <div class="result-title">${riskTitle}</div>
                <div class="result-level"><strong>Risk Seviyeniz:</strong> ${riskLevel}</div>
                <div class="result-description">${riskDescription}</div>
                <div class="result-recommendation">${riskRecommendation}</div>
                <div class="result-next-steps" style="margin-top: 20px;">
                    <p><strong>Bir sonraki adımınız:</strong></p>
                    <a href="iletisim.html" class="button">Uzman Desteği Al</a>
                    <a href="hizmetler.html" class="button" style="margin-left: 10px;">Hizmetlerimizi İncele</a>
                </div>
            `;

            // Risk seviyesine göre CSS sınıfı ekle
            testResults.className = riskClass;

            // Sonuç bölümünü göster ve yumuşak kaydırma
            testResults.style.display = 'block';
            testResults.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Analytics için (gelecekte kullanılabilir)
            console.log(`Risk Testi Tamamlandı - Skor: ${percentageScore}%, Risk: ${riskLevel}`);
        });
    }
});

// Test sonuçlarını paylaşma özelliği (gelecekteki güncellemeler için hazır)
function shareTestResult(score, riskLevel) {
    const shareText = `GRCKobi Risk Testini tamamladım! Skorum: ${score}%, Risk Seviyem: ${riskLevel}. Sen de testini yap: ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'GRCKobi Risk Testi Sonucum',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: Panoya kopyala
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Sonuç panoya kopyalandı!');
        });
    }
}
// ===== SMOOTH SCROLLING FOR ONE-PAGE LAYOUT - V3.5 FINAL =====
document.addEventListener('DOMContentLoaded', function() {
    // Sadece index.html sayfasındayken çalışsın
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html') || window.location.pathname === '') {
        
        // Tüm # ile başlayan linkleri seç (header navigasyon ve diğer internal linkler)
        const scrollLinks = document.querySelectorAll('a[href^="#"]');
        
        scrollLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Sadece # veya boş değilse işlem yap
                if (href && href !== '#') {
                    e.preventDefault();
                    
                    const targetId = href.substring(1); // # işaretini kaldır
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        // Yumuşak kaydırma
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Navigasyon menüsünü mobilde kapat (varsa)
                        const navMenu = document.getElementById('navMenu');
                        const navToggle = document.getElementById('navToggle');
                        if (navMenu && navMenu.classList.contains('active')) {
                            navMenu.classList.remove('active');
                            if (navToggle) {
                                navToggle.classList.remove('active');
                            }
                        }
                        
                        // URL'yi güncelle (opsiyonel)
                        history.pushState(null, null, href);
                    }
                } else if (href === '#') {
                    // Ana sayfa linki için en üste git
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    history.pushState(null, null, '/');
                }
            });
        });
        
        // Sayfa yüklendiğinde URL'de hash varsa o bölüme git
        if (window.location.hash) {
            setTimeout(() => {
                const targetElement = document.querySelector(window.location.hash);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);
        }
        
        // Scroll spy - hangi bölümde olduğumuzu takip et ve navigation'ı güncelle
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        function updateActiveNav() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                } else if (current === '' && link.getAttribute('href') === '#') {
                    link.classList.add('active');
                }
            });
        }
        
        // Scroll olayını dinle
        window.addEventListener('scroll', updateActiveNav);
        
        // Sayfa yüklendiğinde de çalıştır
        updateActiveNav();
        
        console.log('One-page smooth scrolling initialized for index.html');
    }
});

// ===== V3.5 FINAL - ONE-PAGE LAYOUT COMPLETED =====
