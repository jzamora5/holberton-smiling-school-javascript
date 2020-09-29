$(document).ready(function () {
  //   Quotes ===============================================================

  function displayQuotes(data) {
    let $carousel = $(`
            <div
            id="carouselExampleControls"
            class="carousel slide"
            data-ride="carousel"
        >
            <div class="carousel-inner" id="carousel-items"></div>
            <a
            class="carousel-control-prev arrow-left"
            href="#carouselExampleControls"
            role="button"
            data-slide="prev"
            >
            <img
                src="images/arrow_white_left.png"
                alt="Quote Previous"
                aria-hidden="true"
            />
            <span class="sr-only">Previous</span>
            </a>
            <a
            class="carousel-control-next arrow-right"
            href="#carouselExampleControls"
            role="button"
            data-slide="next"
            >
            <img
                src="images/arrow_white_right.png"
                alt="Quote Next"
                aria-hidden="true"
            />
            <span class="sr-only">Next</span>
            </a>
        </div>
    `);
    $("#carousel").append($carousel);
    let classItem = "";
    for (let i in data) {
      classItem = i == 0 ? "carousel-item active" : "carousel-item";
      let $carouselItem = $(`
        <blockquote class="${classItem}">
        <div class="row mx-auto align-items-center">
            <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
            <img
                src="${data[i].pic_url}"
                class="d-block align-self-center"
                alt="Carousel Pic 1"
            />
            </div>
            <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
            <div class="quote-text">
                <p class="text-white pr-md-4 pr-lg-5">
                ${data[i].text}
                </p>
                <h4 class="text-white font-weight-bold">${data[i].name}</h4>
                <span class="text-white">${data[i].title}</span>
            </div>
            </div>
        </div>
        </blockquote>;
    `);

      $("#carousel-items").append($carouselItem);
    }

    // END OF displayQuotes
  }

  function displayLoader(active, id) {
    if (active) {
      let $loader = $(`<div class="loader my-5" id="loader-${id}"></div>`);
      $(`#${id}`).append($loader);
    } else {
      let $loader = $(`#loader-${id}`);
      $loader.remove();
    }

    // END OF displayLoader
  }

  function requestData(url, callback, id) {
    displayLoader(true, id);
    $.ajax({
      url: url,
      type: "GET",
      headers: { "Content-Type": "application/json" },
      success: function (response) {
        displayLoader(false, id);
        callback(response);
      },
      error: function (error) {
        alert("Error sending Getting Data");
      },
    });
    // END OF requestData
  }

  requestData(
    "https://smileschool-api.hbtn.info/quotes",
    displayQuotes,
    "carousel"
  );
  //   END OF DOCUMENT READY
});
