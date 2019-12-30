# Adds live HP to D&D Beyond Campaigns
# //www.dndbeyond.com/campaigns/*

const setHp = async () => {
  const elementParents = Array.from(document.querySelectorAll('.ddb-campaigns-detail-body-listing-active .ddb-campaigns-character-card-header-upper'));
  const nodes = elementParents.map(el => el.children.item(0));
  const characters = await Promise.all(nodes.map(async el => (await (await fetch(`${el.href.substring(6, 10000)}/json`)).json()).character));
  const charactersHP = characters.map(({ id, baseHitPoints, removedHitPoints }) => ({ id, baseHitPoints, removedHitPoints }));

  console.log(nodes);
  console.log(characters);
  console.log(charactersHP);

  nodes.forEach((node, i) => {
    const hpElement = document.createElement('span');
    const currentHpElement = document.createElement('span');
    const maxHpElement = document.createElement('span');
    const currentHp = (characters[i].baseHitPoints - characters[i].removedHitPoints);
    const maxHp = characters[i].baseHitPoints;
    const hpDifference = (currentHp / maxHp);
    const id = `injector-hp-${characters[i].id}`;
    const oldHpElement = document.getElementById(id);
    let color = '#4CAF50';

    if (hpDifference <= 0.5) color = '#FFEB3B';
    if (hpDifference <= 0.2) color = '#F44336';

    currentHpElement.style.cssText = `color:${color};`;
    currentHpElement.textContent = currentHp;
    maxHpElement.textContent = ` / ${maxHp}`;
    hpElement.style.cssText = 'position:absolute;bottom:0;right:0;color:white;font-weight:bold;';
    hpElement.setAttribute('id', id);
    
    hpElement.appendChild(currentHpElement);
    hpElement.appendChild(maxHpElement);

    
    if (oldHpElement) node.replaceChild(hpElement, oldHpElement);
    else node.appendChild(hpElement);
  });
};

setHp();
setInterval(setHp, 10000);
