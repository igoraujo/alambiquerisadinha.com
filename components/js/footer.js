document.addEventListener('DOMContentLoaded', () => {
  const footerPlaceholder = document.getElementById('footer-placeholder');

  if (footerPlaceholder) {
    fetch('components/footer.html')
      .then(response => {
        if (!response.ok) throw new Error('Erro ao carregar o footer');
        return response.text();
      })
      .then(data => {
        footerPlaceholder.innerHTML = data;
      })
      .catch(error => console.error(error));
  }
});