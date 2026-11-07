// BUHAY PINOY - Dialogue & Taglish NPC Conversation System
class DialogueSystem {
  constructor(economy, player) {
    this.economy = economy;
    this.player = player;
    this.currentNPC = null;

    // Rich fallback Taglish dialogue trees for each character
    this.dialogueTrees = {
      aling_nena: {
        chika: [
          'Alam mo ba iho, si Kagawad Boyet nakita ko kahapon, bumili ng limang balot ng chicharon para raw sa inuman sa kanto!',
          'Hala, tumaas na naman ang presyo ng asukal at mantika galing San Pedro, pero para sa mga suki tulad mo, walang dagdag!',
          'Uy Juan, si Kuya Jun mo doon sa covered court, kanina pa nagpa-praktis ng tres. Baka gusto mo siyang hamunin!'
        ],
        advice: 'Basta masipag ka lang dito sa barangay, hindi ka magugutom. Mag-ipon ka muna bago bumili ng sariling tricycle!',
        questions: {
          'saan ang palengke': 'Doon lang sa kanto pakaliwa sa may talipapa, iho. Hinahanap ka rin yata ni Mang Kanor.',
          'may trabaho ba': 'Naku sakto! Mag-aayos sana ako ng mga sitsirya at delata sa estante. Tulungan mo ako, bibigyan kita ng ₱120!',
          'magkano pandesal': 'Limang piso lang isa, bagong luto pa mula sa pugon ni Mang Tonyo!'
        }
      },
      mang_berting: {
        chika: [
          'Grabe ang traffic kanina sa may Crossing papuntang Los Baños! Buti na lang alam ko yung shortcut sa loob ng mga barangay road.',
          'Itong tricycle ko, labinlimang taon na sakin. Ilang beses nang tumirik pero buhay pa rin ang makina!',
          'Pag gabi rito sa Calamba, masarap humigop ng mainit na bulalo sa may bypass road.'
        ],
        advice: 'Ingat sa pagtawid sa highway ha, lalo na kapag mabilis magpatakbo ang mga jeep mula Cabuyao.',
        questions: {
          'saan ang palengke': 'Diretso ka lang sa Rizal Avenue, bago mag-tulay nandoon ang talipapa.',
          'may trabaho ba': 'Kung marunong ka mag-mekaniko o maglinis ng sidecar, puwede kitang bayaran sa garahe mamaya.',
          'magkano pamasahe': '₱15 lang ang regular special trip rito sa loob ng barangay, boss!'
        }
      },
      kuya_jun: {
        chika: [
          'Pre, tignan mo tong bagong sapatos ko, galing Divisoria pero pang-NBA ang kapit sa semento!',
          'Pustahan tayo mamayang alas-singko, may inter-barangay tournament laban sa Brgy. Bucal.',
          'Dito sa covered court, walang pikon! Basta tira lang nang tira hanggang pumasok ang bola!'
        ],
        advice: 'Ang sekreto sa tres pre, ibabad mo ang follow-through mo. Tsaka wag kakabahan pag may bantay!',
        questions: {
          'saan ang palengke': 'Lagpas sa tindahan ni Aling Nena, pre. Pero wag ka muna umalis, mag-shoot muna tayo!',
          'may trabaho ba': 'Gusto mo ng pera? Talunin mo ako sa 3-Point Shootout! May ₱100 premyo pag naka-3 shoots ka!',
          'sino pinakamagaling': 'Ako siyempre! Pero si Kapitan Roger daw noong kabataan niya, scoring champion dito sa Laguna.'
        }
      },
      nanay_rosa: {
        chika: [
          'Naku anak, maaga akong nagising kaninang alas-kwatro para pakuluan ang buto-buto ng baka sa sinigang.',
          'Bakit parang pumapayat ka Juan? Halika rito at lagyan kita ng extra sinangag at pritong lumpia!',
          'Yung sikreto ko sa masarap na adobo, kaunting asukal na pula at maraming tinadtad na bawang mula Batangas.'
        ],
        advice: 'Kumain ka sa tamang oras iho. Ang kalusugan ang tunay na kayamanan sa buhay.',
        questions: {
          'saan ang palengke': 'Doon sa dulo ng kalsada anak, kay Mang Kanor ako kumukuha ng sariwang gulay at kangkong.',
          'may trabaho ba': 'Aba oo! Marami akong hugasing pinggan at magse-serve ng tapsilog sa tanghalian. May ₱130 ka rito!',
          'anong masarap': 'Subukan mo ang Tapsilog Special natin, ₱70 lang busog na busog ka na buong maghapon!'
        }
      },
      mang_kanor: {
        chika: [
          'Galing ako sa Tanauan kaninang madaling araw para magbaba ng saging na saba at manggang piko.',
          'Mabigat ang karga pero basta para sa pamilya, kayod lang nang kayod.',
          'Matabang ang lupa ngayon sa rice paddies natin dahil sa ulan noong isang linggo, maganda ang ani!'
        ],
        advice: 'Pag pawisan ang likod mo, maglagay ka lagi ng bimpo tulad ko para hindi ka mapulmonya.',
        questions: {
          'saan ang palengke': 'Eto na mismo ang talipapa, boss! Bili ka na ng mangga o buko juice pampalamig.',
          'may trabaho ba': 'Sakto dating mo! May dalawang kahon ng gulay na ibababa galing sa jeep. Tulungan mo ako, ₱150 sa iyo agad!',
          'magkano mangga': 'Limampung piso lang ang kilo ng matatamis na manggang hinog!'
        }
      },
      kapitan_roger: {
        chika: [
          'May paparating tayong libreng medical mission at pagpapabakuna sa covered court sa darating na Sabado.',
          'Ipinagmamalaki ko ang katahimikan ng ating barangay dito sa Calamba, salamat sa kooperasyon ng lahat.',
          'Kung may problema kayo sa kapitbahay o kailangan ng Barangay Clearance, bukas ang opisina ko.'
        ],
        advice: 'Maging responsableng mamamayan. Huwag magtapon ng basura sa mga kanal at kanal upang maiwasan ang baha.',
        questions: {
          'saan ang palengke': 'Nasa gawing kanluran, katapat ng terminal ng jeepney sa Rizal Avenue.',
          'may trabaho ba': 'Naghahanap ang barangay ng volunteer para sa clean-up drive at tree planting sa tabi ng palayan.',
          'kumusta barangay': 'Payapa at maunlad ang Brgy. Real! Patuloy tayong naglilingkod nang tapat.'
        }
      }
    };
  }

  openDialogue(npc) {
    this.currentNPC = npc;

    const modal = document.getElementById('dialogue-modal');
    const nameEl = document.getElementById('dialogue-npc-name');
    const roleEl = document.getElementById('dialogue-npc-role');
    const avatarEl = document.getElementById('dialogue-npc-avatar');
    const speechEl = document.getElementById('dialogue-speech-text');

    if (nameEl) nameEl.textContent = npc.name;
    if (roleEl) roleEl.textContent = npc.role;
    if (avatarEl) avatarEl.textContent = npc.avatarEmoji || '👤';
    if (speechEl) speechEl.textContent = `"${npc.greeting}"`;

    if (modal) modal.classList.add('open');
    if (window.soundSystem) window.soundSystem.playInteract();
  }

  closeDialogue() {
    const modal = document.getElementById('dialogue-modal');
    if (modal) modal.classList.remove('open');
    this.currentNPC = null;
  }

  askChika() {
    if (!this.currentNPC) return;
    const tree = this.dialogueTrees[this.currentNPC.id];
    const speechEl = document.getElementById('dialogue-speech-text');
    if (tree && tree.chika && speechEl) {
      const randomChika = tree.chika[Math.floor(Math.random() * tree.chika.length)];
      speechEl.textContent = `"${randomChika}"`;
      if (window.soundSystem) window.soundSystem.playInteract();
    }
  }

  askJob() {
    if (!this.currentNPC) return;
    const speechEl = document.getElementById('dialogue-speech-text');

    if (this.currentNPC.id === 'aling_nena') {
      speechEl.textContent = '"Sige iho! Ayusin mo ang mga delata at sitsirya sa estante. 10 segundo lang, may ₱120 ka!"';
      setTimeout(() => {
        window.gameUI.openJobsModal();
      }, 700);
    } else if (this.currentNPC.id === 'nanay_rosa') {
      speechEl.textContent = '"Sakto anak! Pakihugasan ang mga kaldero at mag-serve sa mesa. May ₱130 ka!"';
      setTimeout(() => {
        window.gameUI.openJobsModal();
      }, 700);
    } else if (this.currentNPC.id === 'mang_kanor') {
      speechEl.textContent = '"Aba oo! Tulungan mo akong buhatin ang mga kahon ng gulay mula sa jeep, ₱150 sa iyo!"';
      setTimeout(() => {
        window.gameUI.openJobsModal();
      }, 700);
    } else if (this.currentNPC.id === 'kuya_jun') {
      speechEl.textContent = '"Tara! 3-Point Shootout tayo sa court. Maka-3 shoots ka lang, akin ang talo, ₱100 sayo!"';
      setTimeout(() => {
        this.closeDialogue();
        window.basketballGame.startShootout();
      }, 800);
    } else {
      speechEl.textContent = `"${this.dialogueTrees[this.currentNPC.id]?.advice || 'Mag-ikot ka lang sa barangay, marami diyang nangangailangan ng tulong!'}"`;
    }
  }

  openShop() {
    if (!this.currentNPC) return;
    this.closeDialogue();
    window.gameUI.openStoreModal(this.currentNPC.id);
  }

  // Handle custom typed question from player (with smart Taglish NLP + Gemini integration hook)
  sendCustomQuestion(questionText) {
    if (!this.currentNPC || !questionText.trim()) return;
    const speechEl = document.getElementById('dialogue-speech-text');
    const inputEl = document.getElementById('ai-chat-input-field');
    if (inputEl) inputEl.value = '';

    const qLower = questionText.toLowerCase();
    const tree = this.dialogueTrees[this.currentNPC.id];

    speechEl.textContent = '🤔 "Teka lang ha, nag-iisip..."';

    // Simulate smart NPC thought time
    setTimeout(() => {
      let reply = null;

      // Check matching keywords in dialogue tree
      if (tree && tree.questions) {
        for (const [key, answer] of Object.entries(tree.questions)) {
          if (qLower.includes(key)) {
            reply = answer;
            break;
          }
        }
      }

      // Contextual fallbacks based on question topics
      if (!reply) {
        if (qLower.includes('pera') || qLower.includes('sahod') || qLower.includes('ipon')) {
          reply = `Naku, sipag at tiyaga lang dito sa Calamba. Puwede kang mag-helper sa tindahan o magbuhat sa talipapa para kumita ng pesos!`;
        } else if (qLower.includes('jeep') || qLower.includes('sakay') || qLower.includes('byahe')) {
          reply = `Yung jeepney papuntang Crossing at Los Baños, nasa tapat lang ng talipapa nakaparada. ₱13 lang ang pamasahe!`;
        } else if (qLower.includes('basketball') || qLower.includes('laro')) {
          reply = `Doon sa covered court laging may laro! Hanapin mo si Kuya Jun doon, mahilig sa pustahan yun.`;
        } else if (qLower.includes('pagkain') || qLower.includes('gutom') || qLower.includes('ulam')) {
          reply = `Pumunta ka sa Carinderia ni Nanay Rosa! May tapsilog at mainit na sabaw ng sinigang doon.`;
        } else {
          // Dynamic personality response
          reply = `Aba, magandang tanong 'yan iho! Sa tingin ko, basta nagtutulungan tayong mga taga-Brgy. Real, kayang-kaya natin 'yan!`;
        }
      }

      speechEl.textContent = `"${reply}"`;
      if (window.soundSystem) window.soundSystem.playInteract();
    }, 450);
  }
}

window.DialogueSystem = DialogueSystem;
