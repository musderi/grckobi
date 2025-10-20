// DOM yüklendiğinde script'in çalışmasını bekle
document.addEventListener('DOMContentLoaded', function () {
  
  // Gerekli HTML elementlerini seç
  const submitButton = document.getElementById('submitButton');
  const resultArea = document.getElementById('resultArea'); // Sonuçları göstereceğimiz 'kart'
  const resultText = document.getElementById('resultText');   // Sonucun yazılacağı 'h2'
  const form = document.getElementById('riskTestForm');       // Formun kendisi

  // Butona tıklandığında calculateRisk fonksiyonunu çalıştır
  if (submitButton) {
    submitButton.addEventListener('click', calculateRisk);
  }

  /**
   * Risk skorunu hesaplar ve sonucu ekrana yazdırır.
   */
  function calculateRisk() {
    let score = 0;
    const totalQuestions = 5;

    // Formdaki tüm 'radio' buton gruplarını (q1, q2...) döngüye al
    for (let i = 1; i <= totalQuestions; i++) {
      const questionName = 'q' + i;
      const selectedOption = form.querySelector(`input[name="${questionName}"]:checked`);

      // Eğer bir cevap seçilmemişse uyarı ver ve dur
      if (!selectedOption) {
        alert('Lütfen ' + i + '. soruyu yanıtlayın.');
        return; // Fonksiyonu durdur
      }

      // Puanlama mantığı
      if (selectedOption.value === 'no') {
        score += 2; // 'Hayır' cevabı 2 puan
      }
      // 'Evet' cevabı 0 puan
    }

    // Sonucu belirle
    let riskMessage = '';
    
    if (score <= 2) { // 0-2 Puan
      riskMessage = `SONUÇ: Düşük Risk (Puan: ${score}/10). Harika! Temel güvenlik adımlarını atıyorsunuz. Yine de GRC bir yolculuktur, öğrenmeye devam edin.`;
    } else if (score <= 6) { // 4-6 Puan
      riskMessage = `SONUÇ: Orta Risk (Puan: ${score}/10). İyi bir başlangıç, ancak iyileştirilmesi gereken önemli alanlar var. Özellikle yedekleme ve KVKK konularına odaklanmalısınız.`;
    } else { // 8-10 Puan
      riskMessage = `SONUÇ: Yüksek Risk (Puan: ${score}/10). Dikkat! İşletmeniz temel siber risklere karşı savunmasız. Acil önlem almalısınız.`;
    }

    // Sonucu ekrana yazdır
    resultText.innerText = riskMessage;
    
    // Gizli olan sonuç kartını görünür yap
    resultArea.style.display = 'block'; 
  }
});
