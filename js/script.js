// WhatsApp integration and form handling
(function(){
  // Shop WhatsApp number in international format without plus, e.g. 919999999999
  const WHATSAPP_NUMBER = '919942980980';

  function openWhatsApp(prefilled){
    const base = 'https://api.whatsapp.com/send?phone=' + encodeURIComponent(WHATSAPP_NUMBER);
    const url = base + '&text=' + encodeURIComponent(prefilled);
    window.open(url,'_blank');
  }

  // Attach handler to any form with data-whatsapp attribute
  function attachFormHandlers(root=document){
    root.querySelectorAll('form[data-whatsapp]').forEach(form=>{
      form.addEventListener('submit', e=>{
        e.preventDefault();
        const data = new FormData(form);
        const type = data.get('type') || form.dataset.type || 'Enquiry';
        let msg = `${type} - A1 Mobile Sales & Service\n`;
        // include specific known fields
        ['productType','deviceType','brand','model','problemType','pickup','customerName','customerPhone','address','freeDelivery','notes'].forEach(k=>{
          if(data.get(k)) msg += `${capitalize(k)}: ${data.get(k)}\n`;
        });
        msg += '\nPayment: Cash On Delivery Only.';
        openWhatsApp(msg);
      });
    });
  }

  // Service page: select-service buttons scroll to form and pre-fill deviceType
  function attachServiceButtons(){
    document.querySelectorAll('.select-service').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const card = e.target.closest('.service-card');
        const target = card?.dataset.target || '';
        const formSection = document.getElementById('serviceFormSection');
        if(formSection){
          formSection.scrollIntoView({behavior:'smooth',block:'center'});
          // prefill device type based on selection
          const form = document.getElementById('detailedServiceForm');
          if(form){
            const deviceMap = {mobile:'Mobile',smartwatch:'Smart Watch',normalwatch:'Normal Watch'};
            const val = deviceMap[target] || 'Mobile';
            form.querySelector('[name=deviceType]').value = val;
          }
        }
      });
    });
    // type-pill quick select: set problemType
    document.querySelectorAll('.type-pill').forEach(p=>{
      p.addEventListener('click', e=>{
        const val = e.target.dataset.value;
        const form = document.getElementById('detailedServiceForm');
        if(form){
          const sel = form.querySelector('[name=problemType]');
          if(sel) sel.value = val;
          form.scrollIntoView({behavior:'smooth',block:'center'});
        }
      });
    });
    // hero book button
    const heroBook = document.getElementById('heroBookWhats');
    if(heroBook) heroBook.addEventListener('click', e=>{ e.preventDefault(); openWhatsApp('Hello, I want to book a service. Please assist.'); });
  }

  // Order / Enquire buttons on product cards
  function attachProductButtons(root=document){
    root.querySelectorAll('.order-btn, .enquire-btn').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const card = e.target.closest('.product-card');
        if(!card) return;
        const brand = card.dataset.brand || '';
        const model = card.dataset.model || '';
        
        // Get selected values (fallback to dataset if not found)
        const ramSel = card.querySelector('.ram-select');
        const ram = ramSel ? ramSel.value : (card.dataset.ram || '');
        
        const storeSel = card.querySelector('.storage-select');
        const storage = storeSel ? storeSel.value : (card.dataset.storage || '');

        const colorSelect = card.querySelector('.color-select');
        const color = colorSelect ? colorSelect.value : (card.dataset.color || '');

        const action = 'Availability Check';
        let msg = `${action} - ${brand} ${model}\n`;
        if(ram) msg += `RAM: ${ram} GB\n`;
        if(storage) msg += `Storage: ${storage} GB\n`;
        if(color && color !== 'Select Color') msg += `Color: ${color}\n`;
        
        msg += '\nIs this available? Please let me know price and details.';
        openWhatsApp(msg);
      });
    });
  }

  // Simple client-side filtering for product cards
  function applyFiltersOnPage(){
    // Mobiles filters
    const grid = document.querySelectorAll('.product-grid');
    if(!grid) return;
    const cards = document.querySelectorAll('.product-card');
    if(cards.length===0) return;

    const runMobileFilter = ()=>{
       const fBrand = document.getElementById('filterBrand')?.value || '';
       const searchInput = document.getElementById('modelSearch');
       const q = searchInput ? searchInput.value.toLowerCase().trim() : '';

       document.querySelectorAll('.product-grid .product-card').forEach(card=>{
         let show = true;
         const brand = (card.dataset.brand || '').toLowerCase();
         // If brand is selected, strict match. If brand is empty, show all brands.
         if(fBrand && brand !== fBrand.toLowerCase()) show = false;
         
         const model = (card.dataset.model || '').toLowerCase();
         // If search text exists, check if model name includes the search text
         if(q.length > 0 && !model.includes(q)) show = false;
         
         card.style.display = show? 'flex':'none';
       });
    };

    // generic filter apply handlers if filter controls exist
    const applyBtn = document.getElementById('applyFilters');
    if(applyBtn){
      if(!applyBtn.dataset.listenerAttached){
          applyBtn.addEventListener('click', runMobileFilter);
          applyBtn.dataset.listenerAttached = 'true';
      }
    }
    
    const modelInput = document.getElementById('modelSearch');
    if(modelInput){
       modelInput.addEventListener('input', runMobileFilter);
    }
    
    // Reset Filters
    const resetBtn = document.getElementById('resetFilters');
    if(resetBtn){
      resetBtn.addEventListener('click', ()=>{
        const fb = document.getElementById('filterBrand');
        if(fb) fb.value = '';
        const ms = document.getElementById('modelSearch');
        if(ms) ms.value = '';
        runMobileFilter();
      });
    }

    // Mobile Filter Toggle Button Logic
    const toggleBtn = document.getElementById('toggleFilters');
    const filtersPanel = document.querySelector('.filters');
    const closeBtn = document.getElementById('closeFilters');
    
    // Create overlay for mobile filter drawer
    let overlay = document.querySelector('.filter-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'filter-overlay';
        document.body.appendChild(overlay);
    }

    function openFilters() {
        if(filtersPanel) filtersPanel.classList.add('open');
        if(overlay) overlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeFilters() {
        if(filtersPanel) filtersPanel.classList.remove('open');
        if(overlay) overlay.classList.remove('open');
        document.body.style.overflow = ''; 
    }

    if(toggleBtn){
      toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openFilters();
      });
    }
    
    if(closeBtn){
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeFilters();
        });
    }

    if(overlay){
        overlay.addEventListener('click', closeFilters);
    }

    // Run filter immediately when called
    runMobileFilter();

    // Watches and Accessories simple apply buttons
    const applyWatch = document.getElementById('applyWatchFilters');
    if(applyWatch){applyWatch.addEventListener('click', ()=>{ const sec = document.getElementById('watchSection')?.value || 'all'; document.querySelectorAll('.product-card').forEach(card=>{const s=card.dataset.section||'all'; card.style.display = (sec==='all' || s===sec) ? 'flex':'none'}); });}
    const applyAcc = document.getElementById('applyAccFilters');
    if(applyAcc){
      applyAcc.addEventListener('click', ()=>{ 
        const cat = document.getElementById('accCategory')?.value || 'all'; 
        const brand = document.getElementById('accBrand')?.value || '';
        
        document.querySelectorAll('.product-grid .product-card').forEach(card=>{
          const c = card.dataset.category || 'all'; 
          const b = card.dataset.brand || '';
          
          const matchCat = (cat === 'all' || c === cat);
          const matchBrand = (brand === '' || b === brand);
          
          card.style.display = (matchCat && matchBrand) ? 'flex':'none';
        }); 
      });
    }

  }

  function capitalize(s){ return s? s.charAt(0).toUpperCase()+s.slice(1):'' }

  // Quick banner/order buttons
  const orderBtn = document.getElementById('orderWhatsapp');
  if(orderBtn) orderBtn.addEventListener('click', e=>{ e.preventDefault(); openWhatsApp('Hello, I want to order. Please share available models and price.\nPayment: Cash On Delivery.'); });

  // Chatbot Integration (Gemini API)
  const GEMINI_API_KEY = "AIzaSyBdjLJCfKGe-siZtnGCAia9G-YnSnTadAU";
  const CHATBOT_HTML = `
    <button class="chatbot-toggler">
      <span>💬</span>
      <span>✕</span>
    </button>
    <div class="chatbot">
      <header>
        <h2>A1 Assistant</h2>
        <span class="close-btn">✕</span>
      </header>
      <ul class="chatbox">
        <li class="chat incoming">
          <span>🤖</span>
          <p>Hi there! I'm A1 Mobile's jolly assistant. How can I help you today? 😄</p>
        </li>
      </ul>
      <div class="chat-input">
        <textarea placeholder="Enter a message..." spellcheck="false" required></textarea>
        <span id="send-btn">➤</span>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", CHATBOT_HTML);

  const chatbotToggler = document.querySelector(".chatbot-toggler");
  const closeBtn = document.querySelector(".close-btn");
  const chatbox = document.querySelector(".chatbox");
  const chatInput = document.querySelector(".chat-input textarea");
  const sendChatBtn = document.querySelector(".chat-input span");

  let userMessage = null;
  const inputInitHeight = chatInput ? chatInput.scrollHeight : 0;

  const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span>🤖</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
  }

  const generateResponse = (chatElement) => {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const messageElement = chatElement.querySelector("p");

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: "You are a helpful, jolly, and witty assistant for A1 Mobile Sales & Service. You love mobiles, watches, and accessories. Speak in a fun, friendly manner. Keep answers concise. Respond to: " + userMessage }]
        }]
      })
    }

    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
      messageElement.textContent = data.candidates[0].content.parts[0].text.trim();
    }).catch(() => {
      messageElement.classList.add("error");
      messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
  }

  const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
      const incomingChatLi = createChatLi("Thinking...", "incoming");
      chatbox.appendChild(incomingChatLi);
      chatbox.scrollTo(0, chatbox.scrollHeight);
      generateResponse(incomingChatLi);
    }, 600);
  }

  if(chatInput) {
    chatInput.addEventListener("input", () => {
      chatInput.style.height = `${inputInitHeight}px`;
      chatInput.style.height = `${chatInput.scrollHeight}px`;
    });

    chatInput.addEventListener("keydown", (e) => {
      if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
      }
    });
  }

  if(sendChatBtn) sendChatBtn.addEventListener("click", handleChat);
  if(closeBtn) closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
  if(chatbotToggler) chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

  // initialize on DOM ready
  document.addEventListener('DOMContentLoaded', ()=>{ attachFormHandlers(); attachProductButtons(); applyFiltersOnPage(); populateBrandList(); bindModelSelection(); attachServiceButtons();
    // service form dynamic brand/model behavior
    const svcForm = document.getElementById('detailedServiceForm');
    if(svcForm){
      const deviceSel = svcForm.querySelector('[name=deviceType]');
      const brandInput = svcForm.querySelector('[name=brand]');
      const modelInput = svcForm.querySelector('[name=model]');
      const problemSel = svcForm.querySelector('[name=problemType]');
      // initialize brand and problem list for default device
      resetBrandDropdown();
      resetModelDropdown();
      resetProblemDropdown();
      updateBrandOptions(deviceSel?.value || 'Mobile');
      updateProblemOptions(deviceSel?.value || 'Mobile');

      deviceSel?.addEventListener('change', ()=>{
        // Full reset all dropdowns
        resetBrandDropdown();
        resetModelDropdown();
        resetProblemDropdown();
        updateBrandOptions(deviceSel.value);
        updateProblemOptions(deviceSel.value);
      });

      brandInput?.addEventListener('input', ()=>{
        // Reset and load models for selected brand and device type
        resetModelDropdown();
        populateServiceModelList(brandInput.value, deviceSel.value);
      });

      function resetBrandDropdown() {
        if (brandInput) brandInput.value = '';
        const brandList = document.getElementById('brandList');
        if (brandList) brandList.innerHTML = '<option value="">Select Brand...</option>';
      }
      function resetModelDropdown() {
        if (modelInput) modelInput.value = '';
        const modelList = document.getElementById('modelList');
        if (modelList) modelList.innerHTML = '<option value="">Select Model...</option>';
      }
      function resetProblemDropdown() {
        if (problemSel) problemSel.innerHTML = '<option>Select Problem...</option>';
      }
    }

    // Dynamically update problem type options based on device type
    function updateProblemOptions(deviceType) {
      const problemSel = document.querySelector('#detailedServiceForm [name=problemType]');
      if (!problemSel) return;
      let problems = [];
      if (deviceType === 'Mobile') {
        problems = [
          'Display Replacement',
          'Battery Replacement',
          'Charging Port Repair',
          'Water Damage Repair',
          'Camera Repair',
          'Dead Phone Repair',
          'Software Update',
          'Speaker / Mic Repair',
          'Network Issue',
          'Other'
        ];
      } else if (deviceType === 'Smart Watch') {
        problems = [
          'Display Replacement',
          'Touch Issue',
          'Battery Replacement',
          'Charging Issue',
          'Strap Replacement',
          'Water Damage',
          'Software Issue',
          'Other'
        ];
      } else if (deviceType === 'Watch') {
        problems = [
          'Battery Change',
          'Glass Change',
          'Dial Repair',
          'Strap Replacement',
          'Button Repair',
          'Water Damage',
          'General Cleaning',
          'Other'
        ];
      }
      problemSel.innerHTML = '<option>Select Problem...</option>' + problems.map(p => `<option>${p}</option>`).join('');
    }

    // Dynamically update brand options based on device type
    function updateBrandOptions(deviceType) {
      const brandList = document.getElementById('brandList');
      if (!brandList) return;
      let brands = [];
      if (deviceType === 'Mobile') {
        brands = [
          'Apple', 'Samsung', 'Xiaomi', 'Vivo', 'Oppo', 'Realme', 'OnePlus', 'Motorola', 'iQOO', 'Poco', 'Nokia', 'Infinix', 'Tecno', 'Lava', 'Micromax', 'Nothing', 'Google Pixel', 'Asus', 'Honor', 'Sony', 'Lenovo', 'ZTE', 'HTC', 'Panasonic', 'Alcatel', 'Other'
        ];
      } else if (deviceType === 'Smart Watch') {
        brands = [
          'Apple', 'Samsung', 'Noise', 'boAt', 'Fire-Boltt', 'Fastrack', 'Amazfit', 'Realme', 'Other'
        ];
      } else if (deviceType === 'Watch') {
        brands = [
          'Titan', 'Casio', 'Sonata', 'Timex', 'Fastrack', 'Seiko', 'Citizen', 'Maxima', 'Daniel Klein', 'Other'
        ];
      }
      brandList.innerHTML = '<option value="">Select Brand...</option>' + brands.map(b => `<option value="${b}"></option>`).join('');
    }
  });

  // Populate brand dropdown from data.js
  function populateBrandList(){
    try{
      const brands = window.BRAND_DATA?.brands || [];
      const sel = document.getElementById('filterBrand');
      if(!sel) return;
      sel.innerHTML = '<option value="">All Brands</option>' + brands.map(b=>`<option>${b}</option>`).join('');
      sel.addEventListener('change', ()=>{ populateModelsForBrand(sel.value); });
    }catch(err){/* ignore */}
  }

  // Populate brand datalist for service form depending on device type
  function populateServiceBrandList(deviceType){
    try{
      const brandInput = document.querySelector('#detailedServiceForm [name=brand]');
      const brandList = document.getElementById('brandList');
      if(!brandInput || !brandList) return;
      // watch types
      const watchTypes = ['smart watch','normal watch','smartwatch','normalwatch','watch'];
      let brands = window.BRAND_DATA?.brands || [];
      // if deviceType is watch, limit to watch brands
      if(deviceType && watchTypes.includes(deviceType.toString().toLowerCase())){
        brands = ['Titan','Fastrack','Sonata','Boat','Noise','Fire-Boltt','Samsung','Other'];
      }
      brandList.innerHTML = brands.map(b=>`<option value="${b}"></option>`).join('');
    }catch(err){/* ignore */}
  }

  // Populate model datalist for service form when brand is chosen
  function populateServiceModelList(brand, deviceType){
    try{
      const modelList = document.getElementById('modelList');
      if(!modelList) return;
      modelList.innerHTML = '<option value="">Select Model...</option>';
      if(!brand || !deviceType) return;

      // Define model data for each device type and brand
      const MODEL_DATA = {
        'Mobile': {
          'Apple': ['iPhone 15','iPhone 14','iPhone 13','iPhone 12','iPhone 11','iPhone SE'],
          'Samsung': ['Galaxy S23','Galaxy S22','Galaxy S21','Galaxy A54','Galaxy A34','Galaxy M34'],
          'Xiaomi': ['Redmi Note 12','Redmi Note 11','Xiaomi 13','Xiaomi 12'],
          'Vivo': ['Vivo V29','Vivo Y100','Vivo Y56'],
          'Oppo': ['Oppo Reno 10','Oppo F23','Oppo A78'],
          'Realme': ['Realme 11 Pro','Realme Narzo 60','Realme C55'],
          'OnePlus': ['OnePlus 12','OnePlus 11R','OnePlus Nord 3'],
          'Motorola': ['Moto G84','Moto Edge 40','Moto G54'],
          'iQOO': ['iQOO Z7','iQOO Neo 7','iQOO 11'],
          'Poco': ['Poco X6','Poco F5','Poco M6'],
          'Nokia': ['Nokia G42','Nokia C32','Nokia X30'],
          'Infinix': ['Infinix Note 30','Infinix Hot 30','Infinix Zero 30'],
          'Tecno': ['Tecno Camon 20','Tecno Spark 10','Tecno Phantom X2'],
          'Lava': ['Lava Agni 2','Lava Blaze 2','Lava Yuva 2'],
          'Micromax': ['Micromax In Note 2','Micromax In 2b'],
          'Nothing': ['Nothing Phone 2','Nothing Phone 1'],
          'Google Pixel': ['Pixel 8','Pixel 7a','Pixel 7'],
          'Asus': ['Asus ROG 7','Asus Zenfone 9'],
          'Honor': ['Honor 90','Honor X9b'],
          'Sony': ['Sony Xperia 1 V','Sony Xperia 10 V'],
          'Lenovo': ['Lenovo K14','Lenovo Legion Y70'],
          'ZTE': ['ZTE Axon 40','ZTE Blade V40'],
          'HTC': ['HTC U23','HTC Desire 22'],
          'Panasonic': ['Panasonic Eluga I8'],
          'Alcatel': ['Alcatel 1S'],
          'Other': ['Other Model']
        },
        'Smart Watch': {
          'Apple': ['Watch Ultra 2','Watch Series 9','Watch Series 8','Watch Series 7','Watch SE','Watch Series 6'],
          'Samsung': ['Galaxy Watch 6','Galaxy Watch 5','Galaxy Watch 4','Galaxy Watch 3'],
          'Noise': ['Noise ColorFit Pro 4','NoiseFit Halo','NoiseFit Force'],
          'boAt': ['boAt Wave Call','boAt Xtend','boAt Storm'],
          'Fire-Boltt': ['Fire-Boltt Visionary','Fire-Boltt Ninja','Fire-Boltt Phoenix'],
          'Fastrack': ['Fastrack Reflex Beat','Fastrack Reflex Vox'],
          'Amazfit': ['Amazfit GTS 4','Amazfit Bip 3','Amazfit T-Rex 2'],
          'Realme': ['Realme Watch 3','Realme Watch 2 Pro'],
          'Other': ['Other Model']
        },
        'Watch': {
          'Titan': ['Titan Neo','Titan Regalia','Titan Raga'],
          'Casio': ['Casio G-Shock','Casio Edifice','Casio Youth'],
          'Sonata': ['Sonata Super Fibre','Sonata Analog','Sonata Digital'],
          'Timex': ['Timex Expedition','Timex Analog','Timex Digital'],
          'Fastrack': ['Fastrack Trendies','Fastrack Analog','Fastrack Digital'],
          'Seiko': ['Seiko 5','Seiko Presage'],
          'Citizen': ['Citizen Eco-Drive','Citizen Analog'],
          'Maxima': ['Maxima Attivo','Maxima Analog'],
          'Daniel Klein': ['Daniel Klein Premium','Daniel Klein Analog'],
          'Other': ['Other Model']
        }
      };

      let models = [];
      if (MODEL_DATA[deviceType] && MODEL_DATA[deviceType][brand]) {
        models = MODEL_DATA[deviceType][brand];
      }
      modelList.innerHTML += models.map(m => `<option value="${m}"></option>`).join('');
    }catch(err){/* ignore */}
  }

  // Populate model series panel for selected brand
  function populateModelsForBrand(brand){
    const seriesRoot = document.getElementById('modelSeries');
    const search = document.getElementById('modelSearch');
    if(!seriesRoot || !search) return;
    seriesRoot.innerHTML = '';
    search.value = '';
    search.dataset.selectedModel = '';
    if(!brand || !window.BRAND_DATA?.models || !window.BRAND_DATA.models[brand]){
      seriesRoot.innerHTML = '<div style="color:#666;font-size:0.95rem">Select a brand to view models</div>';
      return;
    }
    const data = window.BRAND_DATA.models[brand];
    // show categories: Latest, Popular, then series
    const makeList = (title, items)=>{
      const el = document.createElement('div');
      el.innerHTML = `<strong>${title}</strong>`;
      const ul = document.createElement('div'); ul.style.margin='6px 0 12px';
      items.forEach(m=>{
        const btn = document.createElement('button'); btn.className='enquire-btn'; btn.style.margin='4px 6px 4px 0'; btn.textContent = m;
        btn.addEventListener('click', ()=>{ search.dataset.selectedModel = m; search.value = m; applyFiltersOnPage(); });
        ul.appendChild(btn);
      });
      el.appendChild(ul);
      seriesRoot.appendChild(el);
    };
    if(data.latest && data.latest.length) makeList('Latest Models', data.latest);
    if(data.popular && data.popular.length) makeList('Popular Models', data.popular);
    if(data.series){
      Object.keys(data.series).forEach(seriesName=>{
        makeList(seriesName, data.series[seriesName]);
      });
    }
  }

  // model search filter inside panel
  function bindModelSelection(){
    const search = document.getElementById('modelSearch');
    if(!search) return;
    search.addEventListener('input', ()=>{
      const q = search.value.toLowerCase();
      const container = document.getElementById('modelSeries');
      if(!container) return;
      Array.from(container.querySelectorAll('button')).forEach(btn=>{
        btn.style.display = btn.textContent.toLowerCase().includes(q)? 'inline-block':'none';
      });
    });
  }

})();
