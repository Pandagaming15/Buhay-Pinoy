// BUHAY PINOY - Economy & Inventory System
class EconomySystem {
  constructor(player) {
    this.player = player;
    this.wallet = 500; // Starting wallet in Philippine Pesos (₱)

    // Catalog of authentic Filipino goods
    this.catalog = {
      pandesal: { id: 'pandesal', name: 'Mainit na Pandesal', price: 5, icon: '🥖', desc: 'Bagong hango sa pugon. Nakakabusog sa umaga.', heal: 0, stamina: 20 },
      taho: { id: 'taho', name: 'Mainit na Taho', price: 25, icon: '🍯', desc: 'May arnibal at sago mula kay Manong magtataho.', heal: 25, stamina: 25 },
      siopao: { id: 'siopao', name: 'Siopao Asado', price: 35, icon: '🥟', desc: 'Malaman at may matamis na asado sauce.', heal: 40, stamina: 15 },
      tapsilog: { id: 'tapsilog', name: 'Tapsilog Special', price: 70, icon: '🍳', desc: 'Tapa, sinangag, at pritong itlog. Paborito sa almusal!', heal: 75, stamina: 50 },
      softdrink: { id: 'softdrink', name: 'Malamig na Softdrink', price: 25, icon: '🥤', desc: 'Nasa plastik na may straw. Pampatid-uhaw!', heal: 5, stamina: 30 },
      buko_juice: { id: 'buko_juice', name: 'Buko Juice sa Plastik', price: 20, icon: '🥥', desc: 'Sariwang buko na may gatas at yelo.', heal: 25, stamina: 25 },
      chicharon: { id: 'chicharon', name: 'Chicharon with Suka', price: 30, icon: '🥓', desc: 'Malutong na pulutan o merienda na may maanghang na suka.', heal: 15, stamina: 10 }
    };

    // Starting inventory
    this.inventory = [
      { id: 'pandesal', count: 3 },
      { id: 'buko_juice', count: 1 }
    ];

    this.loadState();
  }

  loadState() {
    try {
      const savedWallet = localStorage.getItem('bp_wallet');
      if (savedWallet !== null) this.wallet = parseInt(savedWallet, 10);

      const savedInv = localStorage.getItem('bp_inventory');
      if (savedInv) this.inventory = JSON.parse(savedInv);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  saveState() {
    try {
      localStorage.setItem('bp_wallet', this.wallet.toString());
      localStorage.setItem('bp_inventory', JSON.stringify(this.inventory));
    } catch (e) {
      console.warn('Save error:', e);
    }
    this.updateHUD();
  }

  addMoney(amount, reason = '') {
    this.wallet += amount;
    this.saveState();
    if (window.soundSystem) window.soundSystem.playCoin();
    window.gameUI.showToast(`+₱${amount} ${reason}`);
  }

  spendMoney(amount, reason = '') {
    if (this.wallet < amount) {
      window.gameUI.showToast('Kulang ang pera mo! (Not enough pesos)');
      return false;
    }
    this.wallet -= amount;
    this.saveState();
    if (window.soundSystem) window.soundSystem.playCoin();
    window.gameUI.showToast(`-₱${amount} ${reason}`);
    return true;
  }

  buyItem(itemId) {
    const item = this.catalog[itemId];
    if (!item) return false;

    if (this.spendMoney(item.price, `binili ang ${item.name}`)) {
      const existing = this.inventory.find(i => i.id === itemId);
      if (existing) {
        existing.count += 1;
      } else {
        this.inventory.push({ id: itemId, count: 1 });
      }
      this.saveState();
      return true;
    }
    return false;
  }

  useItem(itemId) {
    const index = this.inventory.findIndex(i => i.id === itemId);
    if (index === -1) return false;

    const entry = this.inventory[index];
    const item = this.catalog[itemId];
    if (!item) return false;

    // Apply item effects to player
    if (item.heal > 0 && this.player) this.player.heal(item.heal);
    if (item.stamina > 0 && this.player) this.player.boostStamina(item.stamina);

    entry.count -= 1;
    if (entry.count <= 0) {
      this.inventory.splice(index, 1);
    }

    if (window.soundSystem) window.soundSystem.playInteract();
    window.gameUI.showToast(`Kinain/Ininom ang ${item.name}! (+HP / +Stamina)`);
    this.saveState();
    return true;
  }

  updateHUD() {
    const walletEl = document.getElementById('wallet-amount');
    if (walletEl) {
      walletEl.textContent = this.wallet.toLocaleString();
    }
  }
}

window.EconomySystem = EconomySystem;
