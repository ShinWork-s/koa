/**
 * KOA FIT - スポーツ障害専門パーソナルトレーニング
 * メインJavaScriptファイル (高級デザイン版)
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // =============== ユーティリティ関数 ===============
    /**
     * 要素を選択するユーティリティ関数
     * @param {string} selector - CSSセレクタ
     * @param {boolean} all - 全ての要素を取得するかどうか
     * @returns {Element|NodeList} - 選択された要素
     */
    const select = (selector, all = false) => {
        return all ? 
            document.querySelectorAll(selector) : 
            document.querySelector(selector);
    };

    /**
     * スクロールイベントにリスナーを追加するユーティリティ関数
     * @param {string} selector - CSSセレクタ
     * @param {function} callback - コールバック関数
     */
    const onScroll = (selector, callback) => {
        const el = select(selector);
        if (el) {
            window.addEventListener('scroll', () => {
                callback(el);
            });
        }
    };

    /**
     * アニメーションしながら数値をカウントアップする関数
     * @param {Element} el - 対象の要素
     * @param {number} target - 目標の数値
     * @param {number} duration - アニメーションの時間（ミリ秒）
     */
    const animateCounter = (el, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        const startTime = performance.now();
        
        const updateCounter = (timestamp) => {
            const elapsedTime = timestamp - startTime;
            const currentValue = Math.min(start + (increment * elapsedTime / 16), target);
            
            el.textContent = Math.floor(currentValue);
            
            if (currentValue < target && elapsedTime < duration) {
                requestAnimationFrame(updateCounter);
            } else {
                el.textContent = target;
            }
        };
        
        requestAnimationFrame(updateCounter);
    };

    /**
     * 要素が画面内に表示されているかどうかを判定する関数
     * @param {Element} el - 対象の要素
     * @returns {boolean} - 画面内に表示されているかどうか
     */
    const isInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    /**
     * 現在の年を取得する関数
     * @returns {number} - 現在の年
     */
    const getCurrentYear = () => {
        return new Date().getFullYear();
    };

    // =============== 初期化関数 ===============
    /**
     * ローディングアニメーションの初期化
     */
    const initLoader = () => {
        const loader = select('.loader');
        if (loader) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    loader.classList.add('hidden');
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 500);
                }, 500);
            });
        }
    };

    /**
     * モバイルメニューの初期化
     */
    const initMobileMenu = () => {
        const menuIcon = select('.menu-icon');
        const nav = select('nav');
        const navLinks = select('nav ul li a', true);
        
        if (menuIcon && nav) {
            menuIcon.addEventListener('click', () => {
                menuIcon.classList.toggle('active');
                nav.classList.toggle('active');
                document.body.classList.toggle('no-scroll');
            });
            
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (nav.classList.contains('active')) {
                        menuIcon.classList.remove('active');
                        nav.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                    }
                });
            });
        }
    };

    /**
     * ナビゲーションリンクのアクティブ状態を設定
     */
    const initNavLinks = () => {
        const navLinks = select('nav ul li a', true);
        const sections = select('section', true);
        
        if (navLinks.length && sections.length) {
            window.addEventListener('scroll', () => {
                let current = '';
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 100;
                    const sectionHeight = section.offsetHeight;
                    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                        current = section.getAttribute('id');
                    }
                });
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });
            });
        }
    };

    /**
     * スクロール時のヘッダー挙動の初期化
     */
    const initScrollHeader = () => {
        const header = select('#header');
        
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
    };

    /**
     * トップに戻るボタンの初期化
     */
    const initBackToTop = () => {
        const backToTop = select('#back-to-top');
        
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTop.classList.add('show');
                } else {
                    backToTop.classList.remove('show');
                }
            });
            
            backToTop.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    };

    /**
     * スムーズスクロールの初期化
     */
    const initSmoothScroll = () => {
        const links = select('a[href^="#"]:not([href="#"])', true);
        
        if (links.length) {
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const targetId = link.getAttribute('href');
                    const targetElement = select(targetId);
                    
                    if (targetElement) {
                        const headerHeight = select('#header').offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        }
    };

    /**
     * AOS（Animate On Scroll）の初期化
     */
    const initAOS = () => {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-in-out',
                once: true,
                mirror: false
            });
        }
    };

    /**
     * カウンターの初期化
     */
    const initCounters = () => {
        const counters = select('.counter', true);
        let hasStarted = false;
        
        if (counters.length) {
            const startCounters = () => {
                if (hasStarted) return;
                
                counters.forEach(counter => {
                    if (isInViewport(counter)) {
                        hasStarted = true;
                        const target = parseInt(counter.getAttribute('data-count'), 10);
                        animateCounter(counter, target);
                    }
                });
            };
            
            // スクロールイベントでカウンターをトリガー
            window.addEventListener('scroll', startCounters);
            
            // 初期表示時にもチェック
            startCounters();
        }
    };

    /**
     * テスティモニアルスライダーの初期化
     */
    const initTestimonialSlider = () => {
        const slider = select('.testimonial-slider');
        if (!slider) return;
        
        const track = select('.testimonial-track');
        const slides = select('.testimonial-slide', true);
        const dotsContainer = select('.testimonial-dots');
        const prevBtn = select('.testimonial-prev');
        const nextBtn = select('.testimonial-next');
        
        let currentIndex = 0;
        const slideWidth = 100;
        const totalSlides = slides.length;
        
        // スライダーの幅を設定
        if (track && totalSlides > 0) {
            track.style.width = `${totalSlides * 100}%`;
            slides.forEach(slide => {
                slide.style.width = `${100 / totalSlides}%`;
            });
        }
        
        // ドットの生成
        if (dotsContainer && slides.length) {
            dotsContainer.innerHTML = ''; // 既存のドットをクリア
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('span');
                dot.classList.add('testimonial-dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('data-index', i);
                dotsContainer.appendChild(dot);
                
                dot.addEventListener('click', () => {
                    goToSlide(i);
                });
            }
        }
        
        // スライドの移動
        const goToSlide = (index) => {
            if (index < 0) {
                index = totalSlides - 1;
            } else if (index >= totalSlides) {
                index = 0;
            }
            
            track.style.transform = `translateX(-${index * (100 / totalSlides)}%)`;
            currentIndex = index;
            
            // ドットのアクティブ状態を更新
            const dots = select('.testimonial-dot', true);
            dots.forEach((dot, i) => {
                if (i === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        };
        
        // 前のスライドへ
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                goToSlide(currentIndex - 1);
            });
        }
        
        // 次のスライドへ
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                goToSlide(currentIndex + 1);
            });
        }
        
        // キーボードでの操作
        document.addEventListener('keydown', (e) => {
            if (isInViewport(slider)) {
                if (e.key === 'ArrowLeft') {
                    goToSlide(currentIndex - 1);
                } else if (e.key === 'ArrowRight') {
                    goToSlide(currentIndex + 1);
                }
            }
        });
        
        // 自動スライド
        let slideInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
        
        // スライダーにマウスが乗ったら自動スライドを停止
        slider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        // スライダーからマウスが離れたら自動スライドを再開
        slider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 5000);
        });
        
        // タッチスワイプ対応
        let startX, moveX;
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            clearInterval(slideInterval); // タッチ中は自動スライドを停止
        });
        
        track.addEventListener('touchmove', (e) => {
            moveX = e.touches[0].clientX;
        });
        
        track.addEventListener('touchend', () => {
            if (startX - moveX > 50) {
                goToSlide(currentIndex + 1);
            } else if (startX - moveX < -50) {
                goToSlide(currentIndex - 1);
            }
            
            // タッチ終了後、自動スライドを再開
            slideInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 5000);
        });
        
        // 初期化時に表示を調整
        window.addEventListener('resize', () => {
            goToSlide(currentIndex);
        });
        
        // 初期表示
        goToSlide(0);
    };

    /**
     * FAQアコーディオンの初期化
     */
    const initFAQ = () => {
        const faqItems = select('.faq-item', true);
        
        if (faqItems.length) {
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // すべてのアイテムを閉じる
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    
                    // クリックされたアイテムが閉じていた場合、開く
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            });
        }
    };

    /**
     * 料金タブの初期化
     */
    const initPriceTabs = () => {
        const tabs = select('.price-tab', true);
        const contents = select('.price-content', true);
        
        if (tabs.length && contents.length) {
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const target = tab.getAttribute('data-target');
                    
                    tabs.forEach(t => t.classList.remove('active'));
                    contents.forEach(c => c.classList.add('hidden'));
                    
                    tab.classList.add('active');
                    select(`#${target}-content`).classList.remove('hidden');
                });
            });
        }
    };

    /**
     * お問い合わせフォームの初期化
     */
    const initContactForm = () => {
        const form = select('#contact-form');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // 入力チェック
                const name = select('#name');
                const email = select('#email');
                const subject = select('#subject');
                const message = select('#message');
                const privacy = select('#privacy');
                let isValid = true;
                
                // 名前のチェック
                if (!name.value.trim()) {
                    showError(name, 'お名前を入力してください');
                    isValid = false;
                } else {
                    hideError(name);
                }
                
                // メールアドレスのチェック
                if (!email.value.trim()) {
                    showError(email, 'メールアドレスを入力してください');
                    isValid = false;
                } else if (!isValidEmail(email.value.trim())) {
                    showError(email, '有効なメールアドレスを入力してください');
                    isValid = false;
                } else {
                    hideError(email);
                }
                
                // 件名のチェック
                if (!subject.value.trim()) {
                    showError(subject, '件名を選択してください');
                    isValid = false;
                } else {
                    hideError(subject);
                }
                
                // メッセージのチェック
                if (!message.value.trim()) {
                    showError(message, 'メッセージを入力してください');
                    isValid = false;
                } else {
                    hideError(message);
                }
                
                // プライバシーポリシーのチェック
                if (!privacy.checked) {
                    showError(privacy, 'プライバシーポリシーに同意してください');
                    isValid = false;
                } else {
                    hideError(privacy);
                }
                
                if (isValid) {
                    // フォーム送信処理
                    // 実際の環境では、ここでAjaxリクエストを送信する
                    
                    // 成功メッセージの表示
                    showFormMessage('success', 'お問い合わせありがとうございます。確認次第、ご連絡いたします。');
                    
                    // フォームリセット
                    form.reset();
                }
            });
        }
        
        // エラーメッセージの表示
        const showError = (input, message) => {
            const formGroup = input.closest('.form-group');
            formGroup.classList.add('error');
            
            let errorMessage = formGroup.querySelector('.error-message');
            if (!errorMessage) {
                errorMessage = document.createElement('div');
                errorMessage.classList.add('error-message');
                formGroup.appendChild(errorMessage);
            }
            
            errorMessage.textContent = message;
        };
        
        // エラーメッセージの非表示
        const hideError = (input) => {
            const formGroup = input.closest('.form-group');
            formGroup.classList.remove('error');
            
            const errorMessage = formGroup.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        };
        
        // フォームメッセージの表示
        const showFormMessage = (type, message) => {
            let formStatus = form.querySelector('.form-status');
            if (!formStatus) {
                formStatus = document.createElement('div');
                formStatus.classList.add('form-status');
                form.appendChild(formStatus);
            }
            
            formStatus.textContent = message;
            formStatus.className = `form-status ${type}`;
            
            setTimeout(() => {
                formStatus.classList.remove(type);
                setTimeout(() => {
                    formStatus.textContent = '';
                }, 300);
            }, 5000);
        };
        
        // メールアドレスのバリデーション
        const isValidEmail = (email) => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        };
    };

    /**
     * Cookie同意バナーの初期化
     */
    const initCookieConsent = () => {
        const cookieBanner = select('.cookie-banner');
        const acceptBtn = select('.cookie-accept');
        const cookieAccepted = localStorage.getItem('cookieAccepted');
        
        if (cookieBanner && !cookieAccepted) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
            
            if (acceptBtn) {
                acceptBtn.addEventListener('click', () => {
                    localStorage.setItem('cookieAccepted', 'true');
                    cookieBanner.classList.remove('show');
                });
            }
        }
    };

    /**
     * 現在の年を更新
     */
    const updateYear = () => {
        const yearElements = select('.current-year', true);
        
        if (yearElements.length) {
            const currentYear = getCurrentYear();
            
            yearElements.forEach(el => {
                el.textContent = currentYear;
            });
        }
    };

    /**
     * ギャラリー画像のモーダル表示機能
     */
    const initGallery = () => {
        const galleryItems = select('.gallery-item', true);
        
        if (galleryItems.length) {
            galleryItems.forEach(item => {
                item.addEventListener('click', () => {
                    const imgSrc = item.querySelector('img').getAttribute('src');
                    const imgAlt = item.querySelector('img').getAttribute('alt');
                    
                    const modal = document.createElement('div');
                    modal.classList.add('gallery-modal');
                    modal.innerHTML = `
                        <div class="gallery-modal-content">
                            <span class="gallery-modal-close">&times;</span>
                            <img src="${imgSrc}" alt="${imgAlt}">
                            <p class="gallery-modal-caption">${imgAlt}</p>
                        </div>
                    `;
                    
                    document.body.appendChild(modal);
                    setTimeout(() => {
                        modal.classList.add('show');
                    }, 10);
                    
                    const close = modal.querySelector('.gallery-modal-close');
                    close.addEventListener('click', () => {
                        modal.classList.remove('show');
                        setTimeout(() => {
                            modal.remove();
                        }, 300);
                    });
                    
                    modal.addEventListener('click', (e) => {
                        if (e.target === modal) {
                            modal.classList.remove('show');
                            setTimeout(() => {
                                modal.remove();
                            }, 300);
                        }
                    });
                });
            });
        }
    };

    /**
     * 予約フォームの初期化と処理
     */
    const initReservationForm = () => {
        const form = select('#reservation-form');
        if (!form) return;

        // 現在の日付を取得し、予約可能な最小日を本日に設定
        const dateInput = select('#res-date');
        if (dateInput) {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            dateInput.min = formattedDate;
            
            // 3ヶ月先までしか予約できないように
            const maxDate = new Date();
            maxDate.setMonth(maxDate.getMonth() + 3);
            dateInput.max = maxDate.toISOString().split('T')[0];
        }

        // 予約フォーム送信時の処理
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // フォームデータの取得
            const formData = {
                date: select('#res-date').value,
                time: select('#res-time').value,
                course: select('#res-course').value,
                name: select('#res-name').value,
                email: select('#res-email').value,
                phone: select('#res-phone').value,
                message: select('#res-message').value
            };
            
            // 通常はここでサーバーにデータを送信
            // サーバー側の実装がないためモックの成功メッセージを表示
            
            // 成功メッセージを表示
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success';
            successMessage.innerHTML = `
                <div class="success-icon"><i class="fas fa-check-circle"></i></div>
                <h3>ご予約ありがとうございます</h3>
                <p>${formData.date} ${formData.time}に${getCourseText(formData.course)}をご予約いたしました。</p>
                <p>確認メールを${formData.email}に送信しました。</p>
            `;
            
            // フォームを非表示にして成功メッセージを表示
            form.style.display = 'none';
            form.parentNode.appendChild(successMessage);
            
            // 5秒後にフォームをリセットして表示
            setTimeout(() => {
                form.reset();
                form.style.display = 'grid';
                successMessage.remove();
            }, 5000);
        });
    };

    /**
     * コースIDからコース名を取得
     */
    const getCourseText = (courseId) => {
        const courses = {
            'trial': 'トライアルコース',
            'standard': 'スタンダードコース',
            'premium': 'プレミアムコース',
            'pair': 'ペアトレーニングコース'
        };
        return courses[courseId] || 'コース';
    };

    /**
     * ページロード時に実行される初期化関数
     */
    const initialize = () => {
        // 基本機能の初期化
        initLoader();
        initMobileMenu();
        initNavLinks();
        initScrollHeader();
        initBackToTop();
        initSmoothScroll();
        initAOS();
        updateYear();
        
        // 各セクションの機能初期化
        initCounters();
        initTestimonialSlider();
        initFAQ();
        initPriceTabs();
        initContactForm();
        initGallery();
        initCookieConsent();
        
        // 新しい予約フォーム初期化
        initReservationForm();
        
        // コンソールにウェルカムメッセージを表示
        console.log('%c KOA FIT - スポーツ障害専門パーソナルトレーニング ', 'background: #8B4513; color: #fff; padding: 10px; border-radius: 5px; font-weight: bold;');
    };
    
    // 初期化の実行
    initialize();
});

/**
 * Google Maps APIのコールバック関数
 */
function initMap() {
    const mapLocation = { lat: 36.3019444, lng: 140.3032887 }; // KOA FITの位置
    const mapEl = document.getElementById('google-map');
    
    if (mapEl) {
        // iframeが存在する場合は何もしない（既にマップが埋め込まれている）
        if (mapEl.querySelector('iframe')) return;
        
        // Googleマップの初期化
        const map = new google.maps.Map(mapEl, {
            center: mapLocation,
            zoom: 15,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "geometry.fill",
                    "stylers": [{"weight": "2.00"}]
                },
                {
                    "featureType": "all",
                    "elementType": "geometry.stroke",
                    "stylers": [{"color": "#9c9c9c"}]
                },
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#8B4513"}]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [{"color": "#f2f2f2"}]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [{"saturation": -100}, {"lightness": 45}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [{"visibility": "simplified"}]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{"color": "#D2B48C"}, {"visibility": "on"}]
                }
            ]
        });
        
        // マーカーの追加
        const marker = new google.maps.Marker({
            position: mapLocation,
            map: map,
            title: 'KOA FIT',
            animation: google.maps.Animation.DROP
        });
        
        // 情報ウィンドウの追加
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="map-info">
                    <h3>KOA FIT</h3>
                    <p>〒309-1712 茨城県笠間市長兎路仁古田入会地1-171</p>
                    <p>TEL: 080-9998-8432</p>
                </div>
            `
        });
        
        // マーカークリック時に情報ウィンドウを表示
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    }
}