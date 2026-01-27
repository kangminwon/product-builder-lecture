// Teachable Machine URL
const URL = "https://teachablemachine.withgoogle.com/models/TKeNZn2yz/";

let model, labelContainer, maxPredictions;

// 페이지 로드 시 모델 미리 로딩
(async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("Model loaded successfully");
    } catch (e) {
        console.error("Model loading failed:", e);
        // alert("모델을 불러오는데 실패했습니다. 인터넷 연결을 확인해주세요!"); // 페이지 이동 시 불필요한 알림 방지
    }
})();

// 이미지 업로드 처리
function handleImageUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = document.getElementById('image-preview');
            img.src = e.target.result;
            img.style.display = "block";
            
            // 이미지 로딩 후 예측 실행
            img.onload = function() {
                predict(img);
            };
        };

        reader.readAsDataURL(input.files[0]);
    }
}

// 예측 함수
async function predict(imageElement) {
    if (!model) {
        document.getElementById('loading-msg').style.display = 'block';
        return; // 모델 로딩 대기 (실제로는 로딩바 등을 보여주는 게 좋음)
    }

    const prediction = await model.predict(imageElement);
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = ""; // 이전 결과 초기화

    // 확률 높은 순으로 정렬
    prediction.sort((a, b) => b.probability - a.probability);

    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className; // "Cat" or "Dog"
        const probability = (prediction[i].probability * 100).toFixed(1);

        // 클래스 이름 한글 변환
        let displayName = className;
        let color = "#bdc3c7"; // 기본 회색

        if (className.toLowerCase().includes("dog")) {
            displayName = "강아지상 🐶";
            color = "#ff9ff3"; // 핑크
        } else if (className.toLowerCase().includes("cat")) {
            displayName = "고양이상 🐱";
            color = "#54a0ff"; // 파랑
        }

        // 결과 바 HTML 생성
        const barHtml = `
            <div class="result-bar-container">
                <div class="result-label">${displayName}</div>
                <div class="progress-bg">
                    <div class="progress-fill" style="width: ${probability}%; background-color: ${color};"></div>
                </div>
                <div style="margin-left: 10px; font-weight:bold;">${probability}%</div>
            </div>
        `;
        resultContainer.innerHTML += barHtml;
    }
}