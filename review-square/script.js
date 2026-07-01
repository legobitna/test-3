// 요소 선택
const reviewTitleInput = document.getElementById('reviewTitle');
const reviewTextInput = document.getElementById('reviewText');
const reviewerNameInput = document.getElementById('reviewerName');
const starBtns = document.querySelectorAll('.star-btn');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');

const previewStars = document.getElementById('previewStars');
const previewTitle = document.getElementById('previewTitle');
const previewText = document.getElementById('previewText');
const reviewCard = document.getElementById('reviewCard');

// 선택된 별점 (기본값: 4)
let selectedRating = 4;

// 별점 버튼 클릭 이벤트
starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 모든 버튼에서 active 클래스 제거
        starBtns.forEach(b => b.classList.remove('active'));
        // 클릭된 버튼에 active 클래스 추가
        btn.classList.add('active');
        // 선택된 별점 저장
        selectedRating = parseInt(btn.dataset.rating);
    });
});

// 카드 생성 버튼 클릭 이벤트
generateBtn.addEventListener('click', () => {
    updatePreview();
});

// 실시간 업데이트를 위한 입력 이벤트
reviewTitleInput.addEventListener('input', () => {
    updatePreview();
});

reviewTextInput.addEventListener('input', () => {
    updatePreview();
});

reviewerNameInput.addEventListener('input', () => {
    updatePreview();
});

// 텍스트를 정사각형으로 재배치하고 말풍선 크기 계산
function autoAdjustCardSize() {
    const reviewTitle = reviewTitleInput.value.trim();
    const reviewText = reviewTextInput.value.trim() || '여기에 리뷰 내용이 표시됩니다';
    const textLength = reviewText.length;
    
    // 1단계: 기본 폰트 크기 결정 (텍스트 길이 기반)
    let baseFontSize;
    if (textLength < 50) {
        baseFontSize = 24;
    } else if (textLength < 100) {
        baseFontSize = 20;
    } else if (textLength < 200) {
        baseFontSize = 18;
    } else if (textLength < 400) {
        baseFontSize = 16;
    } else if (textLength < 600) {
        baseFontSize = 14;
    } else if (textLength < 800) {
        baseFontSize = 13;
    } else if (textLength < 1000) {
        baseFontSize = 12;
    } else {
        baseFontSize = 11;
    }
    
    // 2단계: 임시 측정 div 생성
    const measureDiv = document.createElement('div');
    measureDiv.style.position = 'absolute';
    measureDiv.style.visibility = 'hidden';
    measureDiv.style.fontSize = `${baseFontSize}px`;
    measureDiv.style.lineHeight = '1.5';
    measureDiv.style.whiteSpace = 'pre-wrap';
    measureDiv.style.wordBreak = 'break-word';
    measureDiv.textContent = reviewText;
    document.body.appendChild(measureDiv);
    
    // 3단계: 정사각형에 가까운 너비 찾기
    let optimalWidth = 200;
    let minDiff = Infinity;
    
    // 여러 너비를 시도하면서 정사각형에 가장 가까운 비율 찾기
    for (let width = 200; width <= 800; width += 20) {
        measureDiv.style.width = `${width}px`;
        const height = measureDiv.offsetHeight;
        const diff = Math.abs(width - height);
        
        if (diff < minDiff) {
            minDiff = diff;
            optimalWidth = width;
        }
        
        // 정사각형에 충분히 가까우면 중단
        if (diff < 20) break;
    }
    
    // 4단계: 최적 너비로 실제 텍스트 높이 측정
    measureDiv.style.width = `${optimalWidth}px`;
    const textHeight = measureDiv.offsetHeight;
    document.body.removeChild(measureDiv);
    
    // 5단계: 별점 높이 및 제목 높이 계산
    const starHeight = baseFontSize * 2;
    const titleFontSize = baseFontSize * 1.1;
    const titleHeight = reviewTitle ? titleFontSize * 2 + 10 : 0;
    const gap = 15;
    
    // 6단계: 텍스트 박스 크기 = 최적 너비와 (텍스트 높이 + 별점 높이 + 제목 높이 + gap) 중 큰 값
    const contentWidth = optimalWidth;
    const contentHeight = textHeight + starHeight + titleHeight + gap;
    
    // 7단계: 정사각형으로 만들기 (큰 값 선택)
    const contentSize = Math.max(contentWidth, contentHeight);
    
    // 8단계: 패딩 추가 (말풍선 패딩 + 카드 패딩)
    const speechPadding = 30;
    const cardPadding = 20;
    const totalPadding = (speechPadding + cardPadding) * 2;
    
    // 9단계: 최종 카드 크기 (정사각형)
    let finalCardSize = contentSize + totalPadding;
    
    // 최소/최대 크기 제한
    finalCardSize = Math.max(300, Math.min(1000, finalCardSize));
    
    // 10단계: 카드에 적용
    reviewCard.style.width = `${finalCardSize}px`;
    reviewCard.style.height = `${finalCardSize}px`;
    
    // 11단계: 스타일 적용
    const speechBubble = reviewCard.querySelector('.speech-bubble');
    
    previewText.style.fontSize = `${baseFontSize}px`;
    previewText.style.lineHeight = '1.5';
    previewText.style.width = '100%';
    
    // 별점 크기
    const starFontSize = baseFontSize * 1.5;
    previewStars.style.fontSize = `${starFontSize}px`;

    // 제목 크기
    previewTitle.style.fontSize = `${titleFontSize}px`;
}

// 미리보기 업데이트 함수
function updatePreview() {
    // 별점 표시 (보라색 별)
    const stars = '★'.repeat(selectedRating);
    previewStars.textContent = stars;

    // 제목 표시
    const titleText = reviewTitleInput.value.trim();
    if (titleText) {
        previewTitle.textContent = titleText;
        previewTitle.style.display = 'block';
    } else {
        previewTitle.textContent = '';
        previewTitle.style.display = 'none';
    }

    // 리뷰 텍스트 표시
    const reviewText = reviewTextInput.value.trim();
    if (reviewText) {
        previewText.textContent = reviewText;
    } else {
        previewText.textContent = '여기에 리뷰 내용이 표시됩니다';
    }

    // 카드 크기 자동 조정
    autoAdjustCardSize();
}

// 이미지 다운로드 기능
downloadBtn.addEventListener('click', async () => {
    try {
        // html2canvas를 사용하여 리뷰 카드를 캡처
        const canvas = await html2canvas(reviewCard, {
            backgroundColor: null,
            scale: 2, // 고해상도
            logging: false
        });

        // 캔버스를 blob으로 변환
        canvas.toBlob((blob) => {
            // 다운로드 링크 생성
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const timestamp = new Date().getTime();
            link.download = `review-card-${timestamp}.png`;
            link.href = url;
            link.click();
            
            // 메모리 정리
            URL.revokeObjectURL(url);
        });
    } catch (error) {
        console.error('이미지 생성 중 오류 발생:', error);
        alert('이미지 다운로드 중 오류가 발생했습니다.');
    }
});

// 초기 로드 시 미리보기 업데이트
updatePreview();

