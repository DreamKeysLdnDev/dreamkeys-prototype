// DreamKeys PWA - Young Professional Competition Focus
// Main focus: Win free rent in London, secondary: Landlord features

(function () {
  // Sample data (updated with provided JSON data)
  const appData = {
    // Competition properties from provided data
    competitionProperties: [
      {
        id: 1,
        address: "Modern 2-bed flat in trendy Shoreditch",
        location: "24 Shoreditch High Street, London E1 6PQ",
        rent: 2800,
        bedrooms: 2,
        propertyType: "Designer Flat",
        features: ["Exposed brick walls", "Modern kitchen", "Walking distance to Old Street"],
        description: "Live in the heart of London's creative quarter",
        image: "/api/placeholder/400/250"
      },
      {
        id: 2,
        address: "Luxury studio with Thames views",
        location: "15 Canary Wharf, London E14 5AB",
        rent: 3200,
        bedrooms: 1,
        propertyType: "Luxury Studio",
        features: ["Floor-to-ceiling windows", "Thames views", "24/7 concierge"],
        description: "Wake up to London's skyline every morning",
        image: "/api/placeholder/400/250"
      },
      {
        id: 3,
        address: "Spacious house in vibrant Clapham",
        location: "78 Clapham Junction, London SW11 2QN",
        rent: 2400,
        bedrooms: 3,
        propertyType: "Victorian House",
        features: ["Period features", "Private garden", "Near Clapham Common"],
        description: "Perfect for sharing with friends in South London",
        image: "/api/placeholder/400/250"
      }
    ],
    
    // Ticket bundles from provided data
    ticketBundles: [
      { id: 1, tickets: 1, price: 1, popular: false, description: "Try your luck!" },
      { id: 2, tickets: 5, price: 5, popular: true, description: "Best value - 5x the chances!" },
      { id: 3, tickets: 10, price: 10, popular: false, description: "Maximum chances to win!" }
    ],
    
    // Success stories from provided data
    successStories: [
      {
        name: "Emma, 26",
        story: "Won a year in Shoreditch - changed my life!",
        location: "Marketing Manager"
      },
      {
        name: "James, 29", 
        story: "From Manchester to Canary Wharf winner!",
        location: "Software Developer"
      }
    ],
    
    // Competition data from provided data
    competition: {
      nextDraw: "December 15, 2025",
      totalEntries: "2,847",
      prizesThisMonth: 3
    },
    
    // Landlord properties (secondary feature)
    properties: [
      {
        id: 1,
        address: "24 Shoreditch High Street, London E1 6PQ",
        rent: 2800,
        bedrooms: 2,
        propertyType: "Flat",
        status: "Available",
        guaranteedRentOffer: 30000,
        image: "/api/placeholder/400/250"
      },
      {
        id: 2,
        address: "15 Canary Wharf, London E14 5AB",
        rent: 3200,
        bedrooms: 1,
        propertyType: "Studio",
        status: "Under Management",
        guaranteedRentOffer: 35000,
        image: "/api/placeholder/400/250"
      },
      {
        id: 3,
        address: "78 Clapham Junction, London SW11 2QN",
        rent: 2400,
        bedrooms: 3,
        propertyType: "House",
        status: "Available",
        guaranteedRentOffer: 26000,
        image: "/api/placeholder/400/250"
      }
    ],
    
    landlordProfile: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+44 7123 456789",
      propertyCount: 3,
      totalRentIncome: 8400,
      joinDate: "2025-09-15"
    },
    
    surveyQuestions: [
      "What is your biggest challenge as a landlord?",
      "How do you currently manage your properties?",
      "What would guaranteed annual rent mean for your business?",
      "How important is hands-off property management to you?"
    ]
  };

  // App state
  const state = {
    currentUser: null,
    offerAccepted: false,
    selectedPropertyId: null,
    selectedBundleId: null,
    survey: {
      index: 0,
      answers: {}
    }
  };

  // Utility functions
  function $(selector) {
    return document.querySelector(selector);
  }

  function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
  }

  function formatCurrencyGBP(amount) {
    return new Intl.NumberFormat('en-GB', { 
      style: 'currency', 
      currency: 'GBP', 
      maximumFractionDigits: 0 
    }).format(amount);
  }

  function showScreen(screenId) {
    try {
      // Hide all screens
      $$('.screen').forEach(screen => screen.classList.remove('active'));
      
      // Show target screen
      const targetScreen = $('#' + screenId);
      if (targetScreen) {
        targetScreen.classList.add('active');
        console.log('Showing screen:', screenId);
        
        // Initialize screen-specific content
        initializeScreen(screenId);
      } else {
        console.error('Screen not found:', screenId);
      }
    } catch (error) {
      console.error('Error showing screen:', error);
    }
  }

  function initializeScreen(screenId) {
    switch (screenId) {
      case 'tenant-listings':
        renderCompetitionProperties();
        break;
      case 'property-detail':
        renderCompetitionPropertyDetail();
        break;
      case 'ticket-purchase':
        initTicketPurchase();
        break;
      case 'landlord-dashboard':
        renderDashboard();
        break;
      case 'guaranteed-rent-offer':
        setupOfferScreenButtons();
        break;
      case 'survey':
        initSurvey();
        break;
      case 'help':
        initHelpButtons();
        break;
    }
  }

  // Success overlay functions
  let overlayCallback = null;

  function showSuccessOverlay(title, message, callback) {
    const overlay = $('#success-overlay');
    const titleEl = $('#success-title');
    const messageEl = $('#success-message');
    
    if (titleEl) titleEl.textContent = title;
    if (messageEl) messageEl.textContent = message;
    if (overlay) overlay.classList.remove('hidden');
    
    overlayCallback = callback;
  }

  function hideSuccessOverlay() {
    const overlay = $('#success-overlay');
    if (overlay) overlay.classList.add('hidden');
    
    if (overlayCallback) {
      const callback = overlayCallback;
      overlayCallback = null;
      callback();
    }
  }

  // Navigation functions
  function handleGetStarted() {
    console.log('Get Started clicked');
    showScreen('user-type-screen');
  }

  function handleUserTypeSelection(userType) {
    console.log('User type selected:', userType);
    if (userType === 'landlord') {
      showScreen('landlord-registration');
    } else if (userType === 'tenant') {
      state.selectedPropertyId = null;
      showScreen('tenant-listings');
    }
  }

  function handleLandlordRegistration(e) {
    e.preventDefault();
    
    const name = $('#landlord-name').value.trim();
    const email = $('#landlord-email').value.trim();
    const phone = $('#landlord-phone').value.trim();
    const propertyCount = $('#property-count').value;

    if (!name || !email || !phone || !propertyCount) {
      alert('Please fill in all fields');
      return;
    }

    state.currentUser = { name, email, phone, propertyCount };
    
    showSuccessOverlay(
      'Account Created',
      'Your DreamKeys account has been created successfully!',
      () => showScreen('landlord-dashboard')
    );
  }

  // Competition Properties Rendering (Main Feature)
  function renderCompetitionProperties() {
    const propertiesList = $('#competition-properties-list');
    if (!propertiesList) return;

    propertiesList.innerHTML = '';
    
    appData.competitionProperties.forEach(property => {
      const card = document.createElement('div');
      card.className = 'competition-property-card';
      
      card.innerHTML = `
        <div class="property-image">Amazing London Property</div>
        <div class="competition-property-info">
          <h3 class="property-title">${property.address}</h3>
          <p class="property-location">${property.location}</p>
          <div class="property-value">
            <span class="monthly-rent">${formatCurrencyGBP(property.rent)}/month</span>
            <span class="property-type">${property.propertyType}</span>
          </div>
          <div class="property-features">
            ${property.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
          </div>
          <p class="property-description">${property.description}</p>
        </div>
      `;
      
      card.addEventListener('click', () => {
        state.selectedPropertyId = property.id;
        showScreen('property-detail');
      });
      
      propertiesList.appendChild(card);
    });
  }

  function getSelectedCompetitionProperty() {
    return appData.competitionProperties.find(p => p.id === state.selectedPropertyId) || appData.competitionProperties[0];
  }

  function renderCompetitionPropertyDetail() {
    const property = getSelectedCompetitionProperty();
    const container = $('#property-detail-content');
    
    if (!container) return;

    container.innerHTML = `
      <div class="property-detail-card">
        <div class="property-image">Amazing London Property</div>
        <div class="property-detail-info">
          <h2>${property.address}</h2>
          <p class="property-location">${property.location}</p>
          
          <div class="property-value">
            <span class="monthly-rent">${formatCurrencyGBP(property.rent)}/month value</span>
            <span class="property-type">${property.bedrooms} ${property.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</span>
          </div>
          
          <div class="property-detail-features">
            ${property.features.map(feature => `<div class="feature-item">${feature}</div>`).join('')}
          </div>
          
          <p style="color: var(--color-text); margin: var(--space-16) 0; line-height: var(--line-height-normal);">
            <strong>${property.description}</strong>
          </p>
          
          <p style="color: var(--color-text-secondary); font-size: var(--font-size-base); line-height: var(--line-height-normal);">
            🎯 <strong>Competition Details:</strong><br>
            • Enter for just £1, £5, or £10<br>
            • Win a full year of free rent<br>
            • Draw date: ${appData.competition.nextDraw}<br>
            • ${appData.competition.totalEntries} people have entered this month
          </p>
        </div>
      </div>
      
      <button class="btn btn--primary btn--lg btn--full-width" id="enter-competition-btn">
        🎉 Enter Competition - Win This Property!
      </button>
    `;

    const enterBtn = $('#enter-competition-btn');
    if (enterBtn) {
      enterBtn.addEventListener('click', () => showScreen('ticket-purchase'));
    }
  }

  function initTicketPurchase() {
    state.selectedBundleId = null;

    // Update selected property summary
    const property = getSelectedCompetitionProperty();
    const summaryContainer = $('#selected-property-summary');
    if (summaryContainer) {
      summaryContainer.innerHTML = `
        <h4 style="margin-bottom: var(--space-8);">🏠 ${property.address}</h4>
        <p style="margin: 0; color: var(--color-text-secondary);">
          Worth ${formatCurrencyGBP(property.rent)}/month • ${property.propertyType}
        </p>
      `;
    }

    // Clear previous selections
    $$('.bundle-card').forEach(card => card.classList.remove('selected'));

    // Set up bundle selection
    $$('.bundle-card').forEach(card => {
      card.addEventListener('click', () => {
        $$('.bundle-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        
        const bundleId = parseInt(card.getAttribute('data-bundle'));
        state.selectedBundleId = bundleId;
        
        const bundle = appData.ticketBundles.find(b => b.id === bundleId);
        const purchaseBtn = $('#purchase-btn');
        
        if (bundle && purchaseBtn) {
          purchaseBtn.disabled = false;
          purchaseBtn.textContent = `🎯 Enter Competition ${formatCurrencyGBP(bundle.price)}`;
        }
      });
    });

    const purchaseBtn = $('#purchase-btn');
    if (purchaseBtn) {
      purchaseBtn.disabled = true;
      purchaseBtn.textContent = 'Select a Bundle';
      
      // Remove any existing listeners and add new one
      const newPurchaseBtn = purchaseBtn.cloneNode(true);
      purchaseBtn.parentNode.replaceChild(newPurchaseBtn, purchaseBtn);
      
      newPurchaseBtn.addEventListener('click', handlePurchaseTickets);
    }
  }

  function handlePurchaseTickets() {
    const bundle = appData.ticketBundles.find(b => b.id === state.selectedBundleId);
    if (!bundle) return;

    const property = getSelectedCompetitionProperty();
    
    showSuccessOverlay(
      'Competition Entry Confirmed! 🎉',
      `You've entered the competition with ${bundle.tickets} ${bundle.tickets === 1 ? 'ticket' : 'tickets'} for ${formatCurrencyGBP(bundle.price)}! You could win a year's free rent at ${property.address}. Draw date: ${appData.competition.nextDraw}. Good luck!`,
      () => showScreen('tenant-listings')
    );
  }

  // Landlord Dashboard (Secondary Feature)
  function renderDashboard() {
    // Update greeting
    const nameDisplay = $('#user-name-display');
    if (nameDisplay) {
      const name = (state.currentUser?.name || appData.landlordProfile.name).split(' ')[0];
      nameDisplay.textContent = name;
    }

    // Update stats
    const monthlyRent = appData.landlordProfile.totalRentIncome;
    const propertyCount = appData.properties.length;
    const totalOffer = appData.properties.reduce((sum, p) => sum + (p.guaranteedRentOffer || 0), 0);

    const monthlyRentStat = $('#monthly-rent-stat');
    const propertyCountStat = $('#property-count-stat');
    const guaranteedOfferStat = $('#guaranteed-offer-stat');

    if (monthlyRentStat) monthlyRentStat.textContent = formatCurrencyGBP(monthlyRent);
    if (propertyCountStat) propertyCountStat.textContent = String(propertyCount);
    if (guaranteedOfferStat) guaranteedOfferStat.textContent = formatCurrencyGBP(totalOffer);

    // Render properties
    const propertiesList = $('#properties-list');
    if (propertiesList) {
      propertiesList.innerHTML = '';
      
      appData.properties.forEach(property => {
        const card = document.createElement('div');
        card.className = 'property-card';
        
        const statusClass = property.status === 'Under Management' 
          ? 'status--under-management' 
          : 'status--available';
        
        card.innerHTML = `
          <div class="property-header">
            <p class="property-address">${property.address}</p>
            <div class="property-rent">${formatCurrencyGBP(property.rent)}</div>
          </div>
          <div class="property-details">
            <span>${property.propertyType} • ${property.bedrooms} ${property.bedrooms === 1 ? 'bed' : 'beds'}</span>
            <span class="status ${statusClass}">${property.status}</span>
          </div>
        `;
        
        propertiesList.appendChild(card);
      });
    }

    updateOfferUI();
  }

  function updateOfferUI() {
    const offerStatus = $('#offer-status');
    const viewOfferBtn = $('#view-offer-btn');
    
    if (state.offerAccepted) {
      if (offerStatus) {
        offerStatus.className = 'status status--success';
        offerStatus.textContent = 'Accepted';
      }
      if (viewOfferBtn) {
        viewOfferBtn.textContent = 'Offer Accepted';
        viewOfferBtn.disabled = true;
      }
    } else {
      if (offerStatus) {
        offerStatus.className = 'status status--success';
        offerStatus.textContent = 'Available';
      }
      if (viewOfferBtn) {
        viewOfferBtn.textContent = 'View Offer Details';
        viewOfferBtn.disabled = false;
      }
    }
  }

  function setupOfferScreenButtons() {
    const acceptOfferBtn = $('#accept-offer-btn');
    const reviewLaterBtn = $('#review-later-btn');
    
    if (acceptOfferBtn && !acceptOfferBtn.dataset.initialized) {
      acceptOfferBtn.dataset.initialized = 'true';
      acceptOfferBtn.addEventListener('click', handleAcceptOffer);
      console.log('Accept offer button event listener attached');
    }
    
    if (reviewLaterBtn && !reviewLaterBtn.dataset.initialized) {
      reviewLaterBtn.dataset.initialized = 'true';
      reviewLaterBtn.addEventListener('click', () => showScreen('landlord-dashboard'));
    }
  }

  function handleAcceptOffer() {
    console.log('Accept offer clicked');
    
    const confirmed = confirm(
      'Please review and accept the terms for your guaranteed rent:\n\n' +
      '• 12-month fixed agreement\n' +
      '• DreamKeys handles tenant placement & management\n' +
      '• 10% platform fee deducted upfront\n\n' +
      'Do you accept these terms?'
    );
    
    if (confirmed) {
      state.offerAccepted = true;
      showSuccessOverlay(
        'Offer Accepted!',
        'Your guaranteed annual rent has been locked in. Funds will be released within 1-2 business days.',
        () => {
          showScreen('landlord-dashboard');
          updateOfferUI();
        }
      );
    }
  }

  function handleAddProperty(e) {
    e.preventDefault();
    
    const address = $('#property-address').value.trim();
    const rent = parseFloat($('#property-rent').value) || 0;
    const type = $('#property-type').value;
    const bedsValue = $('#property-bedrooms').value;

    if (!address || !rent || !type || !bedsValue) {
      alert('Please fill in all fields');
      return;
    }

    const bedrooms = bedsValue === 'studio' ? 0 : 
      (bedsValue.includes('+') ? 4 : parseInt(bedsValue) || 1);

    const newProperty = {
      id: Math.max(...appData.properties.map(p => p.id)) + 1,
      address,
      rent,
      bedrooms,
      propertyType: capitalize(type),
      status: 'Available',
      guaranteedRentOffer: Math.round(rent * 12 * 0.9),
      image: ''
    };

    appData.properties.push(newProperty);
    appData.landlordProfile.totalRentIncome += rent;

    // Clear form
    e.target.reset();

    showSuccessOverlay(
      'Property Added!',
      'Your property has been added successfully. A guaranteed rent offer is now available.',
      () => showScreen('landlord-dashboard')
    );
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  // Survey functionality
  function initSurvey() {
    state.survey.index = 0;
    state.survey.answers = {};
    
    const totalQuestions = $('#total-questions');
    if (totalQuestions) {
      totalQuestions.textContent = String(appData.surveyQuestions.length);
    }
    
    renderSurveyStep();
  }

  function renderSurveyStep() {
    const currentIndex = state.survey.index;
    const totalQuestions = appData.surveyQuestions.length;
    
    const currentQuestionEl = $('#current-question');
    if (currentQuestionEl) {
      currentQuestionEl.textContent = String(currentIndex + 1);
    }

    const progressBar = $('#survey-progress');
    if (progressBar) {
      const percentage = Math.round((currentIndex / totalQuestions) * 100);
      progressBar.style.width = percentage + '%';
    }

    const container = $('#survey-container');
    if (!container) return;

    const question = appData.surveyQuestions[currentIndex];
    
    container.innerHTML = `
      <div class="question-text">${question}</div>
      <div class="form-group">
        <label class="form-label">Your answer</label>
        <textarea id="survey-answer" class="form-control" rows="4" 
                  placeholder="Type your response..." required></textarea>
      </div>
      <div class="flex justify-between gap-8">
        <button class="btn btn--outline" id="survey-prev" 
                ${currentIndex === 0 ? 'disabled' : ''}>Back</button>
        <button class="btn btn--primary" id="survey-next">
          ${currentIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    `;

    // Pre-fill existing answer
    const answerField = $('#survey-answer');
    const existingAnswer = state.survey.answers[currentIndex];
    if (answerField && existingAnswer) {
      answerField.value = existingAnswer;
    }

    // Add event listeners
    const prevBtn = $('#survey-prev');
    const nextBtn = $('#survey-next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', handleSurveyPrev);
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', handleSurveyNext);
    }
  }

  function handleSurveyPrev() {
    if (state.survey.index > 0) {
      const answer = $('#survey-answer').value.trim();
      state.survey.answers[state.survey.index] = answer;
      state.survey.index--;
      renderSurveyStep();
    }
  }

  function handleSurveyNext() {
    const answerField = $('#survey-answer');
    const answer = answerField ? answerField.value.trim() : '';
    
    if (!answer) {
      alert('Please provide an answer before continuing');
      if (answerField) answerField.focus();
      return;
    }

    state.survey.answers[state.survey.index] = answer;

    if (state.survey.index === appData.surveyQuestions.length - 1) {
      // Survey complete
      showSuccessOverlay(
        'Survey Complete!',
        'Thank you for your responses. A DreamKeys specialist will follow up with tailored next steps.',
        () => showScreen('landlord-dashboard')
      );
    } else {
      state.survey.index++;
      renderSurveyStep();
    }
  }

  // Help functionality
  function initHelpButtons() {
    const emailBtn = $('#email-support-btn');
    const callBtn = $('#call-support-btn');
    const feedbackBtn = $('#feedback-btn');

    if (emailBtn && !emailBtn.dataset.initialized) {
      emailBtn.dataset.initialized = 'true';
      emailBtn.addEventListener('click', () => {
        window.open('mailto:support@dreamkeys.co', '_blank');
      });
    }

    if (callBtn && !callBtn.dataset.initialized) {
      callBtn.dataset.initialized = 'true';
      callBtn.addEventListener('click', () => {
        window.open('tel:+44204567890', '_blank');
      });
    }

    if (feedbackBtn && !feedbackBtn.dataset.initialized) {
      feedbackBtn.dataset.initialized = 'true';
      feedbackBtn.addEventListener('click', () => {
        showScreen('feedback-form');
      });
    }
  }

  function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    showSuccessOverlay(
      'Feedback Sent!',
      'Thank you for your feedback. Our team will review it and get back to you if needed.',
      () => showScreen('help')
    );
  }

  // Initialize the app
  function initializeApp() {
    console.log('Initializing DreamKeys app - Young Professional Focus...');

    try {
      // Set up all event listeners
      setupEventListeners();

      // Show welcome screen
      showScreen('welcome-screen');

      console.log('App initialized successfully');
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  function setupEventListeners() {
    // Get Started button
    const getStartedBtn = $('#get-started-btn');
    if (getStartedBtn) {
      getStartedBtn.addEventListener('click', handleGetStarted);
    }

    // User type selection - Updated order (tenant first)
    const selectLandlord = $('#select-landlord');
    const selectTenant = $('#select-tenant');
    
    if (selectTenant) {
      selectTenant.addEventListener('click', () => handleUserTypeSelection('tenant'));
    }
    
    if (selectLandlord) {
      selectLandlord.addEventListener('click', () => handleUserTypeSelection('landlord'));
    }

    // Back buttons
    setupBackButtons();

    // Forms
    const landlordRegForm = $('#landlord-reg-form');
    if (landlordRegForm) {
      landlordRegForm.addEventListener('submit', handleLandlordRegistration);
    }

    const addPropertyForm = $('#add-property-form');
    if (addPropertyForm) {
      addPropertyForm.addEventListener('submit', handleAddProperty);
    }

    const feedbackForm = $('#feedback-form-element');
    if (feedbackForm) {
      feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    }

    // Dashboard buttons
    const addPropertyBtn = $('#add-property-btn');
    if (addPropertyBtn) {
      addPropertyBtn.addEventListener('click', () => showScreen('add-property'));
    }

    const viewOfferBtn = $('#view-offer-btn');
    if (viewOfferBtn) {
      viewOfferBtn.addEventListener('click', () => showScreen('guaranteed-rent-offer'));
    }

    const surveyBtn = $('#survey-btn');
    if (surveyBtn) {
      surveyBtn.addEventListener('click', () => showScreen('survey'));
    }

    const helpBtn = $('#help-btn');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => showScreen('help'));
    }

    const notificationsBtn = $('#notifications-btn');
    if (notificationsBtn) {
      notificationsBtn.addEventListener('click', () => showScreen('notifications'));
    }

    // Success overlay
    const successContinueBtn = $('#success-continue-btn');
    if (successContinueBtn) {
      successContinueBtn.addEventListener('click', hideSuccessOverlay);
    }
  }

  function setupBackButtons() {
    const backButtons = [
      { id: '#back-to-welcome', screen: 'welcome-screen' },
      { id: '#back-to-usertype', screen: 'user-type-screen' },
      { id: '#back-to-usertype-2', screen: 'user-type-screen' },
      { id: '#back-to-dashboard', screen: 'landlord-dashboard' },
      { id: '#back-to-dashboard-2', screen: 'landlord-dashboard' },
      { id: '#back-to-dashboard-3', screen: 'landlord-dashboard' },
      { id: '#back-to-dashboard-4', screen: 'landlord-dashboard' },
      { id: '#back-to-dashboard-5', screen: 'landlord-dashboard' },
      { id: '#back-to-listings', screen: 'tenant-listings' },
      { id: '#back-to-property-detail', screen: 'property-detail' },
      { id: '#back-to-help', screen: 'help' }
    ];

    backButtons.forEach(({ id, screen }) => {
      const btn = $(id);
      if (btn) {
        btn.addEventListener('click', () => showScreen(screen));
      }
    });
  }

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }

  // Global error handler
  window.addEventListener('error', (e) => {
    console.error('Global error caught:', e.error);
  });

})();