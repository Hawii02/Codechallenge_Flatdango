// The below is my javascript code.
  document.addEventListener('DOMContentLoaded', () => {
    const filmsList = document.getElementById('films');
    const movieDetails = document.getElementById('movie-details');
    const poster = document.getElementById('poster');
    const title = document.getElementById('title');
    const runtime = document.getElementById('runtime');
    const showtime = document.getElementById('showtime');
    const tickets = document.getElementById('tickets');
    const buyTicketButton = document.getElementById('buy-ticket');
  
    // Fetch all films on page load
    fetch("http://localhost:3000/films")
      .then(response => response.json())
      .then(films => {
        filmsList.innerHTML = '';
        films.forEach(film => {
          const filmItem = document.createElement('li');
          filmItem.className = 'film item';
          filmItem.textContent = film.title;
          filmItem.addEventListener('click', () => showMovieDetails(film.id));
          filmsList.appendChild(filmItem);
        });
  
        // Show details of the first movie
        if (films.length > 0) {
          showMovieDetails(films[0].id);
        }
      })
      .catch(error => console.error('Error fetching films:', error));
  
    // Function to show movie details
    function showMovieDetails(filmId) {
      fetch(`http://localhost:3000/films/${filmId}`)
        .then(response => response.json())
        .then(film => {
          poster.src = film.poster; // Use the correct poster URL
          title.textContent = film.title;
          runtime.textContent = `Runtime: ${film.runtime} mins`;
          showtime.textContent = `Showtime: ${film.showtime}`;
          const availableTickets = film.capacity - film.tickets_sold;
          tickets.textContent = `Available Tickets: ${availableTickets}`;
          buyTicketButton.disabled = availableTickets === 0;
          buyTicketButton.addEventListener('click', () => buyTicket(filmId, availableTickets));
        })
        .catch(error => console.error('Error fetching movie details:', error));
    }
  
    // Function to handle buying a ticket
    function buyTicket(filmId, availableTickets) {
      if (availableTickets > 0) {
        // Perform actions to update frontend (decrement available tickets)
        tickets.textContent = `Available Tickets: ${availableTickets - 1}`;
        // Bonus: Indicate sold out if no available tickets
        if (availableTickets - 1 === 0) {
          buyTicketButton.textContent = 'Sold Out';
        }
  
        // Bonus: Persist the updated tickets_sold on the server
        fetch(`http://localhost:3000/films/${filmId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ tickets_sold: availableTickets }),
        })
          .then(response => response.json())
          .then(updatedFilm => console.log('Updated film details:', updatedFilm))
          .catch(error => console.error('Error updating tickets_sold:', error));
      }
    }
  });
  