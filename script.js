document.addEventListener('DOMContentLoaded', async () => {
    const screens = document.querySelectorAll('.screen');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const progressBar = document.getElementById('progress-bar');
    const totalScreens = screens.length;
    let currentScreen = 0;

    const updateProgress = () => {
        const progress = (currentScreen / (totalScreens - 1)) * 100;
        progressBar.style.width = `${progress}%`;
    };

    const showScreen = (screenIndex) => {
        screens.forEach((screen, index) => {
            screen.classList.toggle('hidden', index !== screenIndex);
            screen.classList.toggle('active', index === screenIndex);
        });
        currentScreen = screenIndex;
        updateProgress();
        saveState();
    };

    nextBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (btn.type === 'submit') return; // Handle form submission separately
            if (currentScreen < totalScreens - 1) {
                showScreen(currentScreen + 1);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentScreen > 0) {
                showScreen(currentScreen - 1);
            }
        });
    });

    // --- Language Selection ---
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            langBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        });
    });

    // --- Category Selection ---
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            categoryCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });

    // --- Profile Form ---
    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simple validation check
        if (profileForm.checkValidity()) {
            showScreen(currentScreen + 1);
        }
    });

    // --- Photo Upload ---
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const gallery = document.getElementById('gallery');
    const showcaseMaster = document.getElementById('showcase-master');
    let uploadedFiles = [];

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    });
    fileInput.addEventListener('change', () => handleFiles(fileInput.files));

    const handleFiles = (files) => {
        for (const file of files) {
            if (file.type.startsWith('image/')) {
                uploadedFiles.push(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    galleryItem.innerHTML = `
                        <img src="${e.target.result}" alt="${file.name}">
                        <button class="remove-btn">x</button>
                    `;
                    gallery.appendChild(galleryItem);
                    galleryItem.querySelector('.remove-btn').addEventListener('click', () => {
                        gallery.removeChild(galleryItem);
                        uploadedFiles = uploadedFiles.filter(f => f !== file);
                        checkAchievements();
                    });
                };
                reader.readAsDataURL(file);
            }
        }
        checkAchievements();
    };

    const checkAchievements = () => {
        if (gallery.children.length >= 5) {
            showcaseMaster.classList.add('unlocked');
        }
    };

    // --- Pedigree Builder ---
    const recordBtn = document.getElementById('record-btn');
    recordBtn.addEventListener('click', () => {
        recordBtn.classList.toggle('recording');
        if (recordBtn.classList.contains('recording')) {
            recordBtn.textContent = '🎤 Stop Recording';
            // In a real app, you would start speech recognition here.
        } else {
            recordBtn.textContent = '🎤 Start Recording';
        }
    });

    // --- Finish Setup ---
    const finishBtn = document.getElementById('finish-btn');
    finishBtn.addEventListener('click', () => {
        alert('Congratulations! Your artisan profile is complete.');
        localStorage.clear();
        showScreen(0);
    });

    // --- Data Persistence ---
    const saveState = () => {
        const data = {
            currentScreen,
            profile: {
                name: document.getElementById('artisan-name').value,
                bio: document.getElementById('artisan-bio').value,
                location: document.getElementById('location').value,
            }
            // Add other fields to save
        };
        localStorage.setItem('artisanSetup', JSON.stringify(data));
    };

    const loadState = () => {
        const savedData = localStorage.getItem('artisanSetup');
        if (savedData) {
            const data = JSON.parse(savedData);
            document.getElementById('artisan-name').value = data.profile.name;
            document.getElementById('artisan-bio').value = data.profile.bio;
            document.getElementById('location').value = data.profile.location;
            showScreen(data.currentScreen || 0);
        }
    };

    // Auto-save on form input
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', saveState);
    });

    loadState();

    // --- SplitText animation on welcome title ---
    try {
        const module = await import('./SplitText.js');
        const SplitText = module.default;

        const handleAnimationComplete = () => {
            console.log('All letters have animated!');
        };

        new SplitText({
            target: '#welcome-title',
            text: 'Welcome to the Artisan Craft Marketplace',
            className: 'text-2xl font-semibold text-center',
            delay: 100,
            duration: 0.6,
            ease: 'power3.out',
            splitType: 'chars',
            from: { opacity: 0, transform: 'translateY(40px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
            threshold: 0.1,
            rootMargin: '-100px',
            textAlign: 'center',
            onLetterAnimationComplete: handleAnimationComplete
        });
    } catch (e) {
        console.warn('SplitText module not available', e);
    }
});