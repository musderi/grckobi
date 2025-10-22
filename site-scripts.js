// ===================================
// GRCKOBI V3.5 - FİNAL Site Scripts
// ===================================

// --- AŞAMA 1: Sayfa Yüklenirken Tema Kontrolü (Flaş Önleme) ---
(function() {
    const savedTheme = localStorage.getItem('theme');
    // Eğer tema kaydedilmemişse veya 'light' ise, açık tema varsayılan olsun.
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode-loading'); // Hızlı stil için html'e ekle
        if (document.body) {
             document.body.classList.add('dark-mode');
        } else {
             document.addEventListener('DOMContentLoaded', () => document.body.classList.add('dark-mode'));
        }
    }
})();

// --- AŞAMA 2: Sayfa Tamamen Yüklendiğinde Çalışacak Ana Kod ---
document.addEventListener('DOMContentLoaded', function() {

    // --- Dark Mode Mantığı ---
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const body = document.body;

    // Yardımcı Fonksiyon: Buton İçeriğini Güncelle
    function updateButtonContent(button) {
        if (!button) return;
        const isDarkMode = body.classList.contains('dark-mode');
        button.innerHTML = isDarkMode ? '☀️' : '🌙';
        button.setAttribute('aria-label', isDarkMode ? 'Açık temaya geç' : 'Koyu temaya geç');
        button.setAttribute('title', isDarkMode ? 'Açık temaya geç' : 'Koyu temaya geç');
    }

    // Dark Mode Toggle Fonksiyonu
    function toggleDarkMode() {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        const newTheme = isDarkMode ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        console.log(`Tema değiştirildi: ${newTheme}`);
        updateButtonContent(themeToggleButton); // Buton içeriğini anında güncelle
         // Tema değişimi olayını tetikle (diğer scriptler dinleyebilir)
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleDarkMode);
        // İlk yüklemede buton içeriğini ayarla
        updateButtonContent(themeToggleButton);
    } else {
        console.warn('Theme toggle button (#theme-toggle-button) bulunamadı!');
    }

    // İlk Yükleme Kontrolü (Tema yoksa light yap)
    if (!localStorage.getItem('theme')) {
         localStorage.setItem('theme', 'light'); // Varsayılanı light olarak ayarla
         if(body.classList.contains('dark-mode')){ // Eğer sistem tercihi dark ise ve localstorage boşsa, dark yap
             localStorage.setItem('theme', 'dark');
         } else { // Sistem tercihi light ise veya bilinmiyorsa, dark sınıfını kaldır (emin olmak için)
            body.classList.remove('dark-mode');
         }
         updateButtonContent(themeToggleButton); // İlk yüklemede buton içeriğini doğru ayarla
    }

    // Temizlik: Geçici sınıfı kaldır
    document.documentElement.classList.remove('dark-mode-loading');

    // --- Hoş Geldiniz Baloncuğu Mantığı ---
    const welcomeBubble = document.querySelector('.welcome-bubble');
    const closeBubbleBtn = welcomeBubble ? welcomeBubble.querySelector('.close-btn') : null;
    const welcomeBubbleClosed = localStorage.getItem('welcomeBubbleClosed');
    // Sadece ana sayfada göster (index.html veya /)
    const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/');

    if (welcomeBubble && closeBubbleBtn && welcomeBubbleClosed !== 'true' && isHomePage) {
        welcomeBubble.style.display = 'block'; // Sadece ana sayfada ve kapatılmamışsa göster

        closeBubbleBtn.addEventListener('click', function() {
            welcomeBubble.style.display = 'none';
            localStorage.setItem('welcomeBubbleClosed', 'true');
            console.log('Hoşgeldiniz baloncuğu kapatıldı ve kaydedildi.');
        });
    } else if (welcomeBubble) {
         welcomeBubble.style.display = 'none'; // Diğer durumlarda gizle
    }


    // --- "Yukarı Çık" (Scroll to Top) Butonu Mantığı ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        window.onscroll = function() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                scrollTopBtn.style.display = "block";
            } else {
                scrollTopBtn.style.display = "none";
            }
        };

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Akıllı "Geri Dön" Butonu Mantığı ---
    const smartBackButton = document.getElementById('smartBackButton');
    // Eğer ana sayfada değilsek butonu göster
    if (smartBackButton && !isHomePage) {
         smartBackButton.style.display = 'flex'; // flex kullandık çünkü stil dosyasında öyle tanımlı

         // Sayfa ilk yüklendiğinde sayacı sıfırla (eğer yoksa)
         if (!sessionStorage.getItem('backButtonClickCount')) {
             sessionStorage.setItem('backButtonClickCount', '0');
         }

         smartBackButton.addEventListener('click', function() {
             let clickCount = parseInt(sessionStorage.getItem('backButtonClickCount') || '0', 10);
             clickCount++;
             sessionStorage.setItem('backButtonClickCount', clickCount.toString());

             console.log(`Geri butonu tıklandı. Sayac: ${clickCount}`);

             if (clickCount <= 2) {
                 window.history.back();
             } else {
                 // 3. tıklamada sayacı sıfırla ve ana sayfaya git
                 sessionStorage.setItem('backButtonClickCount', '0');
                 window.location.href = 'index.html'; // Ana sayfaya yönlendir
             }
         });
    } else if(smartBackButton) {
        smartBackButton.style.display = 'none'; // Ana sayfadaysak gizle
    }

    // Sayfa değiştiğinde (ileri/geri gidildiğinde) geri sayacını sıfırla
    window.addEventListener('popstate', function() {
        sessionStorage.setItem('backButtonClickCount', '0');
        console.log("Tarayıcı geçmişinde gezinildi, geri sayacı sıfırlandı.");
         // Sayfa değiştiğinde akıllı geri butonunun görünürlüğünü tekrar kontrol et
         const currentIsHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html') || window.location.pathname.endsWith('/');
         if(smartBackButton){
             smartBackButton.style.display = currentIsHomePage ? 'none' : 'flex';
         }
    });


   // --- İnteraktif Risk Testi Mantığı ---
    const riskTestForm = document.getElementById('riskTestForm');
    const resultsDiv = document.getElementById('test-results');

    if (riskTestForm && resultsDiv) {
        riskTestForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Formun normal gönderimini engelle

            let totalScore = 0;
            const totalQuestions = 15; // Toplam soru sayısı

            // Tüm soruları döngüye al
            for (let i = 1; i <= totalQuestions; i++) {
                const questionName = `q${i}`;
                const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);

                if (selectedOption) {
                    totalScore += parseInt(selectedOption.value, 10);
                } else {
                    // Eğer bir soru cevaplanmamışsa uyarı ver ve işlemi durdur
                    alert(`Lütfen ${i}. soruyu cevaplayınız.`);
                    resultsDiv.style.display = 'none'; // Sonuçları gizle
                    return; // Fonksiyondan çık
                }
            }

            // Yüzdelik skoru hesapla (Maksimum puan: 15 * 2 = 30)
            const maxScore = totalQuestions * 2;
            const percentageScore = Math.round((totalScore / maxScore) * 100);

            let resultClass = '';
            let resultTitle = '';
            let resultDescription = '';
            let resultRecommendation = '';

            // Skora göre sonuçları belirle
            if (percentageScore >= 75) {
                resultClass = 'low-risk';
                resultTitle = 'Düşük Risk';
                resultDescription = `Harika! GRC ve KVKK konularında sağlam bir temeliniz var (%${percentageScore}). Mevcut durumunuzu korumak için düzenli gözden geçirmeler yapmayı unutmayın.`;
                resultRecommendation = '<strong>Öneriler:</strong> Süreçlerinizi dokümante etmeye devam edin, yeni çıkan yasal düzenlemeleri takip edin ve çalışan farkındalığını yüksek tutun.';
            } else if (percentageScore >= 40) {
                resultClass = 'medium-risk';
                resultTitle = 'Orta Risk';
                resultDescription = `İyi bir başlangıç yapmışsınız (%${percentageScore}), ancak iyileştirilmesi gereken önemli alanlar bulunuyor. Özellikle 'Hayır' ve 'Bilmiyorum' cevaplarınıza odaklanmalısınız.`;
                resultRecommendation = '<strong>Öneriler:</strong> Eksik politikalarınızı oluşturun (örn: Veri İmha Politikası), çalışan eğitimlerini sıklaştırın, risk değerlendirmesi yaparak önceliklerinizi belirleyin.';
            } else {
                resultClass = 'high-risk';
                resultTitle = 'Yüksek Risk';
                resultDescription = `Dikkat! İşletmeniz önemli riskler altında olabilir (%${percentageScore}). Özellikle 'Hayır' cevabı verdiğiniz konulara acilen odaklanmanız gerekiyor.`;
                resultRecommendation = '<strong>Öneriler:</strong> Acil bir eylem planı oluşturun. Temel politikalardan başlayın (Bilgi Güvenliği, KVKK Aydınlatma), teknik güvenlik önlemlerinizi gözden geçirin ve mutlaka çalışanlarınızı eğitin. Gerekirse profesyonel destek almayı düşünün.';
            }

            // Sonuçları HTML'e yaz
            resultsDiv.innerHTML = `
                <div class="result-score">${percentageScore}%</div>
                <div class="result-title">Risk Seviyeniz: ${resultTitle}</div>
                <p class="result-description">${resultDescription}</p>
                <div class="result-recommendation">${resultRecommendation}</div>
            `;
            resultsDiv.className = `mt-4 ${resultClass}`; // Class'ı ayarla (mt-4 kalmalı)
            resultsDiv.style.display = 'block'; // Sonuçları görünür yap

            // Sonuçları gösterdikten sonra sayfayı sonuç bölümüne kaydır
            resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

            console.log(`Risk Testi Tamamlandı. Toplam Puan: ${totalScore}, Yüzde: ${percentageScore}%`);
        });
    }

   // --- Yumuşak Kaydırma (Smooth Scroll) - Sadece Ana Sayfa İçin ---
    if (isHomePage) {
        document.querySelectorAll('header .nav-menu a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if(targetElement){
                     // Header yüksekliğini hesaba kat (varsa)
                    const headerOffset = document.querySelector('header') ? document.querySelector('header').offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // 20px ek pay

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });

                    // Tıklanan linke active class ekle, diğerlerinden kaldır
                    document.querySelectorAll('header .nav-menu a').forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });

        // Sayfa kaydırıldığında hangi bölümde olduğunu algılayıp menüyü güncelle
        const sections = document.querySelectorAll('main section[id]');
        window.addEventListener('scroll', navHighlighter);

        function navHighlighter() {
            let scrollY = window.pageYOffset;
            const headerHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 0;

            sections.forEach(current => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - headerHeight - 50; // Biraz pay bırak
                let sectionId = current.getAttribute('id');

                /*
                Eğer kullanıcının mevcut scroll pozisyonu, bölümün üstünden büyükse
                VE bölümün altından küçükse, ilgili menü linkini aktif yap.
                */
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.add('active');
                } else {
                    document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.remove('active');
                }
            });

             // Eğer en üstteyse Ana Sayfa'yı aktif yap
            if (scrollY < sections[0].offsetTop - headerHeight - 50) {
                 document.querySelectorAll('.nav-menu a').forEach(link => link.classList.remove('active'));
                 document.querySelector('.nav-menu a[href="#"]').classList.add('active');
            }
        }
         // İlk yüklemede çalıştır
        navHighlighter();

    } else {
        // Ana sayfa değilse, '#' linklerini normal linklere çevir (opsiyonel ama iyi pratik)
        document.querySelectorAll('header .nav-menu a[href^="#"]').forEach(anchor => {
             const targetId = anchor.getAttribute('href').substring(1); // # işaretini kaldır
             if(targetId){ // Eğer boş değilse (#)
                 anchor.href = `index.html#${targetId}`; // index.html'deki ilgili bölüme git
             } else {
                 anchor.href = 'index.html'; // Ana sayfaya git
             }
        });
    }

}); // DOMContentLoaded Sonu

// ===================================
// V3.5 CİLASI: Hamburger Menü Mantığı
// ===================================
const navToggle = document.getElementById('navToggle');
const mainNavMenu = document.getElementById('mainNavMenu');
const navMenuLinks = mainNavMenu ? mainNavMenu.querySelectorAll('a') : []; // Menüdeki linkleri seç

if (navToggle && mainNavMenu) {
    navToggle.addEventListener('click', function() {
        // Butona ve Menüye .active class'ını ekle/kaldır
        navToggle.classList.toggle('active');
        mainNavMenu.classList.toggle('active');

        // ARIA özelliğini güncelle (Erişilebilirlik için)
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);

        // Menü açıldığında body'nin kaymasını engelle (Opsiyonel ama şık)
        // if (mainNavMenu.classList.contains('active')) {
        //     document.body.style.overflow = 'hidden';
        // } else {
        //     document.body.style.overflow = '';
        // }
    });

    // Menüdeki bir linke tıklandığında menüyü kapat
    navMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navToggle.classList.contains('active')) { // Sadece mobil menü açıksa kapat
                navToggle.classList.remove('active');
                mainNavMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                // document.body.style.overflow = ''; // Kaydırmayı tekrar aktif et
            }
        });
    });

} else {
    console.warn('Hamburger menü elementleri (#navToggle veya #mainNavMenu) bulunamadı!');
}
// ===================================
// V3.5 CİLASI: Mobil Flip Card Dokunma Desteği
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Tüm flip card elemanlarını seç
    const flipCards = document.querySelectorAll('.flip-card');

    flipCards.forEach(card => {
        // Hem tıklama hem de dokunma olayını dinle
        card.addEventListener('click', function() {
            // Cihazın dokunmatik olup olmadığını kontrol et (basit bir yöntem)
            const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);

            // Sadece dokunmatik cihazlarda çalıştır veya hover olmayan durumlarda
            if (isTouchDevice || window.matchMedia("(hover: none)").matches) {
                 // İçindeki .flip-card-inner elementine 'is-flipped' sınıfını ekle/kaldır
                 const innerCard = card.querySelector('.flip-card-inner');
                 if (innerCard) {
                     innerCard.classList.toggle('is-flipped');
                 }
            }
        });

        // Alternatif olarak touchstart da kullanılabilir ama click daha genel
        // card.addEventListener('touchstart', function(e) {
        //     // Sayfanın kaymasını engellememek için dikkatli kullanılmalı
        //     const innerCard = card.querySelector('.flip-card-inner');
        //      if (innerCard) {
        //          innerCard.classList.toggle('is-flipped');
        //      }
        // }, {passive: true}); // Kaydırmayı engellememek için passive: true
    });
});
