document.addEventListener('DOMContentLoaded', function () {
    //let itemCount = 1;
  
    document.getElementById('addItem').addEventListener('click', function () {
  
      const newItem = document.createElement('div');
      newItem.className = 'damage-types';
  
      newItem.innerHTML = `
        <label for="damagetype">Damage Type:</label>
        <input type="text" class="damagetype" name="damagetype[]">
        <label for="damageamount">Damage Amount:</label>
        <input type="number" class="damageamount" name="damageamount[]" step="0.01">
    `;
  
      document.getElementById('damageTypes').appendChild(newItem);
    });

    document.getElementById("calculate").addEventListener('click', function(e) {
        e.preventDefault();
        calculateFinalDamage();
    });
    async function calculateFinalDamage() {
        const enemyType = document.getElementById('enemytype').value.trim();
        const damageTypes = document.querySelectorAll('.damagetype');
        const damageAmounts = document.querySelectorAll('.damageamount');
  
        // Load and parse the text file
        const response = await fetch('enemytypes.txt');
        if (!response.ok) {
            alert("Failed to load enemytypes.txt");
            return;
        }
        const data = await response.text();
        const lines = data.split('\n').map(line => line.trim()).filter(line => line !== '');
  
        // Locate enemy type in file
        const enemyIndex = lines.findIndex(line => line.toLowerCase().includes(enemyType.toLowerCase()));
  
        if (enemyIndex === -1) {
            alert("Enemy type not found!");
            return;
        }
  
        // Collect the next 3 lines (damage types and modifiers)
        const modifiers = {};
        for (let i = enemyIndex + 1; i <= enemyIndex + 3 && i < lines.length; i++) {
            const [type, value] = lines[i].split(':');
            if (type && value) {
                modifiers[type.trim().toLowerCase()] = parseInt(value.trim());
            }
        }
  
        let finalDamage = 0;
  
        for (let i = 0; i < damageTypes.length; i++) {
            const type = damageTypes[i].value.trim().toLowerCase();
            const amount = parseFloat(damageAmounts[i].value);
  
            if (isNaN(amount)) continue;
  
            if (type in modifiers) {
                finalDamage += amount * (modifiers[type] === 1 ? 1.5 : 0.5);
            } else {
                finalDamage += amount;
            }
        }
  
        console.log("Total Damage:", finalDamage);
        // Optionally update the UI with this number
        document.getElementById('totaldamage').textContent = `Total Damage: ${finalDamage.toFixed(2)}`;
    }
})