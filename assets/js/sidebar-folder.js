function spread(count){
    document.querySelectorAll('[id^=folder-checkbox-]:not([id=folder-checkbox-' + count +'])').forEach(n => n.checked = false);
    document.querySelectorAll('[id^=spread-icon-]:not([id=spread-icon-' + count +'])').forEach(n => n.innerHTML = 'arrow_right');

    
    document.getElementById('folder-checkbox-' + count).checked =
    !document.getElementById('folder-checkbox-' + count).checked
    document.getElementById('spread-icon-' + count).innerHTML =
    document.getElementById('spread-icon-' + count).innerHTML == 'arrow_right' ?
    'arrow_drop_down' : 'arrow_right'
}
