
function hienBinhLuan(idbl) {
    var x = document.getElementById(idbl);
    if (x.style.display === 'block') {
        x.style.display = 'none';
    } else {
        x.style.display = 'block';
    }
}