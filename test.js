// ===================================
// GRC KOBİ - Risk Testi Hesaplama Scripti
// test.js
// ===================================

// DOM'un tamamen yüklenmesini bekle
document.addEventListener('DOMContentLoaded', function() {
    console.log('Risk testi scripti yüklendi.');
    
    // Form submit olayını dinle
    const form = document.getElementById('riskTestForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Sayfanın yenilenmesini engelle
            calculateRisk(); // Risk hesaplama fonksiyonunu çağır
        });
    }
});

/**
 * Risk Hesaplama Fonksiyonu
 * Formdaki 5 sorunun cevaplarına göre risk puanı hesaplar
 * ve sonucu kullanıcıya gösterir
 */
function calculateRisk() {
    // Başlangıç risk puanı
    let score = 0;
    
    // Tüm soruları kontrol et (q1'den q5'e kadar)
    for (let i = 1; i <= 5; i++) {
        // Her soru grubunu seç
        const questionName = 'q' + i;
        
        // Seçili radio button'ı bul
        const selectedAnswer = document.querySelector(`input[name="${questionName}"]:checked`);
        
        // Eğer bu soru cevaplanmışsa
        if (selectedAnswer) {
            // Cevap 'no' ise 2 puan ekle, 'yes' ise 0 puan
            if (selectedAnswer.value === 'no') {
                score += 2;
            }
            // 'yes' için puan eklemeye gerek yok (0 puan)
        } else {
            // Eğer soru cevaplanmamışsa kullanıcıyı uyar
            alert(`Lütfen ${i}. soruyu cevaplayın.`);
            return; // Fonksiyonu sonlandır
        }
    }
    
    // Sonuç metnini oluştur
    let resultMessage = '';
    let riskLevel = '';
    let riskClass = '';
    
    // Risk seviyesine göre mesaj belirle
    if (score >= 0 && score <= 2) {
        // Düşük Risk
        riskLevel = 'Düşük Risk';
        riskClass = 'low-risk';
        resultMessage = `SONUÇ: ${riskLevel} (Puan: ${score}/10). Harika! Temel güvenlik adımlarını atıyorsunuz. Yine de GRC bir yolculuktur, öğrenmeye devam edin.`;
    } else if (score >= 4 && score <= 6) {
        // Orta Risk
        riskLevel = 'Orta Risk';
        riskClass = 'medium-risk';
        resultMessage = `SONUÇ: ${riskLevel} (Puan: ${score}/10). İyi bir başlangıç, ancak iyileştirilmesi gereken önemli alanlar var. Özellikle yedekleme ve KVKK konularına odaklanmalısınız.`;
    } else if (score >= 8 && score <= 10) {
        // Yüksek Risk
        riskLevel = 'Yüksek Risk';
        riskClass = 'high-risk';
        resultMessage = `SONUÇ: ${riskLevel} (Puan: ${score}/10). Dikkat! İşletmeniz temel siber risklere karşı savunmasız. Acil önlem almalısınız.`;
    }
    
    // Sonucu HTML'de göster
    const resultElement = document.getElementById('resultText');
    if (resultElement) {
        // Sonuç metnini ekle
        resultElement.textContent = resultMessage;
        
        // CSS sınıflarını temizle ve yeni sınıf ekle
        resultElement.className = ''; // Önceki sınıfları temizle
        resultElement.classList.add('result-box', riskClass);
        
        // Sonucu görünür yap
        resultElement.style.display = 'block';
        
        // Sonuca yumuşak kaydırma yap
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        // Eğer sonuç elementi bulunamazsa konsola hata yaz
        console.error('resultText ID\'li element bulunamadı!');
    }
    
    // Detaylı sonuç bilgisini konsola da yaz (debug için)
    console.log(`Risk Testi Sonucu: ${riskLevel} - Puan: ${score}/10`);
    
    // Her sorunun cevabını konsola yaz (debug için)
    for (let i = 1; i <= 5; i++) {
        const answer = document.querySelector(`input[name="q${i}"]:checked`).value;
        console.log(`Soru ${i}: ${answer === 'yes' ? 'Evet' : 'Hayır'}`);
    }
}

/**
 * Formu Sıfırlama Fonksiyonu (Opsiyonel)
 * Kullanıcı yeni bir test yapmak isterse formu temizler
 */
function resetRiskTest() {
    // Formu sıfırla
    const form = document.getElementById('riskTestForm');
    if (form) {
        form.reset();
    }
    
    // Sonucu gizle
    const resultElement = document.getElementById('resultText');
    if (resultElement) {
        resultElement.style.display = 'none';
        resultElement.textContent = '';
        resultElement.className = '';
    }
    
    console.log('Risk testi formu sıfırlandı.');
}

// Global scope'a fonksiyonları ekle (HTML'den çağırabilmek için)
window.calculateRisk = calculateRisk;
window.resetRiskTest = resetRiskTest;