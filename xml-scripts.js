$(document).ready(function () {
  // XML TO OBJECT LIST =====================================================

  /**
   * Transfrom an XML object to a regular JSON like object
   * @xml  {xml_object} xml to be transformed
   * @key {string} value passed if a specific query must be
   * done in XML
   * @return {Array}  list of parsed data
   */
  function XMLtoObjList(xml, key) {
    let list = [];
    let dic = {};

    XMLElement = $(xml).find(key);

    for (let i = 0; i < XMLElement.length; i++) {
      let obj = {};

      if (key == "video" || key === "course") {
        obj["star"] = $(XMLElement[i]).attr("star");
      }

      if (key === "topic" || key === "sort") {
        // =====================
        let txt = $(XMLElement[i]).text().toLowerCase();

        if (dic[txt]) {
          continue;
        } else {
          dic[txt] = txt;
          obj = dic[txt];
        }

        // =====================
      } else {
        // =====================
        let children = $(XMLElement[i]).children();
        for (let j = 0; j < children.length; j++) {
          let tagName = $(children[j]).prop("tagName");
          obj[tagName] = $(children[j]).text();
        }
        // =====================
      }

      list.push(obj);
    }

    return list;
  }

  //   Quotes ===============================================================
  /**
   * Creates a carousel item and appends it to the DOM
   * @data  {Array} List of data to be displayed as Quotes
   * @return {undefined}  No return
   */
  function displayQuotes(data) {
    data = XMLtoObjList(data, "quote");
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
                alt="Carousel Pic ${i}"
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

  /**
   * Modifies to logic of bootstrap carousel in order for
   * it to move 1 slide at a time
   * @id  {string} Id of a carousel item slide
   * @return {undefined}  No return
   */
  function slideOne(id) {
    $(`#${id} .carousel-item`).each(function () {
      let minPerSlide = 4;
      let next = $(this).next();
      if (!next.length) {
        next = $(this).siblings(":first");
      }
      next.children(":first-child").clone().appendTo($(this));

      for (let i = 0; i < minPerSlide; i++) {
        next = next.next();
        if (!next.length) {
          next = $(this).siblings(":first");
        }

        next.children(":first-child").clone().appendTo($(this));
      }
    });
  }

  /**
   * Creates the string equivalent of a card element in bootstrap
   * @cardData  {object} An object containing data for creating the card
   * @return {string}  string equivalent of a card element in bootstrap
   */
  function createCard(cardData) {
    let starState = "";
    let starString = "";
    let star;
    for (let i = 1; i <= 5; i++) {
      if (i <= cardData.star) {
        starState = "images/star_on.png";
      } else {
        starState = "images/star_off.png";
      }

      star = `<img src="${starState}" alt="star on" width="15px" />`;
      starString += i == 1 ? star : "\n" + star;
    }

    let card = `
    <div class="card">
      <img
        src="${cardData.thumb_url}"
        class="card-img-top"
        alt="Video thumbnail"
      />
      <div class="card-img-overlay text-center">
        <img
          src="images/play.png"
          alt="Play"
          width="64px"
          class="align-self-center play-overlay"
        />
      </div>
      <div class="card-body">
        <h5 class="card-title font-weight-bold">${cardData.title}</h5>
        <p class="card-text text-muted">
            ${cardData["sub-title"]}
        </p>
        <div class="creator d-flex align-items-center">
          <img
            src="${cardData.author_pic_url}"
            alt="Creator of Video"
            width="30px"
            class="rounded-circle"
          />
          <h6 class="pl-3 m-0 main-color">${cardData.author}</h6>
        </div>
        <div class="info pt-3 d-flex justify-content-between">
          <div class="rating">
            ${starString}
          </div>
          <span class="main-color">${cardData.duration}</span>
        </div>
      </div>
    </div>
    `;

    return card;

    // END OF createCard
  }

  /**
   * Creates cards and attaches them to the DOM in order to display
   * the Popular Videos section
   * @data  {Arrray} list of data for creating cards
   * @return {undefined}  no return
   */
  function displayPopular(data) {
    data = XMLtoObjList(data, "video");
    let classItem = "";
    for (let i in data) {
      classItem = i == 0 ? "carousel-item active" : "carousel-item";
      let card = createCard(data[i]);
      let $carouselItem = $(`
      <div class="${classItem}">
        <div class="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
          ${card}
          </div>
      </div>
          `);
      $("#popular-items").append($carouselItem);
    }

    slideOne("popular");
    // END OF displayPopular
  }

  /**
   * Creates cards and attaches them to the DOM in order to display
   * the Latest Videos section
   * @data  {Array} list of data for creating cards
   * @return {undefined}  no return
   */
  function displayLatest(data) {
    data = XMLtoObjList(data, "video");
    let classItem = "";
    for (let i in data) {
      classItem = i == 0 ? "carousel-item active" : "carousel-item";
      let card = createCard(data[i]);
      let $carouselItem = $(`
      <div class="${classItem}">
        <div class="col-12 col-sm-6 col-lg-3 d-flex justify-content-center">
          ${card}
          </div>
      </div>
          `);
      $("#latest-videos-items").append($carouselItem);
    }

    slideOne("latest-videos");
    // END OF displayLatest
  }

  /**
   * Retrieves the needed data of the search bar in the DOM
   * the popular section
   * @return {object}  An object containing the different arguments of search
   * in lowercase and without spaces
   */
  function searchObject() {
    let searchObj = {
      q: $("#keywords-input").val(),
      topic: $("#topic").text().toLowerCase(),
      sort: $("#sort-by").text().toLowerCase().replace(" ", "_"),
    };

    return searchObj;
  }

  /**
   * Creates cards and attaches them to the DOM in order to display
   * the popular section
   * @data  {Array} list of data for creating cards
   * @return {undefined}  no return
   */
  function searchRequest() {
    let searchObj = searchObject();
    let $results = $("#results-items");
    $results.empty();
    $("#results-count").text("");

    for (let r of requestsCourses) {
      requestData(r.url, displayResults, r.id, searchObj);
    }
  }

  /**
   * Returns title to original condition with corresponding
   * caps and spaces
   * @title  {string} title to be parsed
   * @return {string}  parsed title
   */
  function parseTitle(title) {
    if (title) {
      title = title.charAt(0).toUpperCase() + title.slice(1).replace("_", " ");
    }
    return title;
  }

  /**
   * Creates the dropdown menu with the corresponding options from the api
   * @list  {Array} list of options to be displayed
   * @$DOMElement  {list} DOM Element to attach the menu to
   * @$titleElement  {list} corresponding title element in search bar of DOM
   * @return {undefined}  no return
   */
  function displayDropdown(list, $DOMElement, $titleElement) {
    if (list.length) {
      for (let l of list) {
        let s = parseTitle(l);
        let $item = $(`
          <a class="dropdown-item" href="#">${s}</a>
        `);
        $item.click(function () {
          $titleElement.text(s);
          searchRequest();
        });
        $DOMElement.append($item);
      }
    }
  }

  /**
   * Removes unnecesary nodes in XML object
   * @data  {xml_object} XML object
   * @return {xml_object} cleaned xml object
   */
  function cleanXML(data) {
    $(data).find("topics").remove();
    $(data).find("sorts").remove();
    $(data).find("courses").remove();

    return data;
  }

  /**
   * Displays the whole search section in dom
   * @data  {object} object containing information
   * about the topics and sort options
   * @return {undefined} no return
   */
  function displaySearch(data) {
    let title;
    let topics = XMLtoObjList(data, "topic");
    let sorts = XMLtoObjList(data, "sort");

    data = cleanXML(data);

    let $TopicDropdown = $("#topic-dropdown");
    let $TopicTitle = $("#topic");
    title = parseTitle($(data).find("topic").text());
    $TopicTitle.text(title);
    displayDropdown(topics, $TopicDropdown, $TopicTitle);

    let $SortDropdown = $("#sort-dropdown");
    let $SortTitle = $("#sort-by");
    title = parseTitle($(data).find("sort").text());
    $SortTitle.text(title);
    displayDropdown(sorts, $SortDropdown, $SortTitle);

    let $KeywordsInput = $("#keywords-input");

    $KeywordsInput.val($(data).find("q").text());

    $KeywordsInput.change(function () {
      searchRequest();
    });
  }

  /**
   * Shows all of the videos, obtained after request to API, in DOM
   * @data  {object} object containing result from API response
   * @return {undefined}  no return
   */
  function displayResults(data) {
    let courses = XMLtoObjList(data, "course");
    if (!courses) return;
    let $results = $("#results-items");

    let count = Object.keys(courses).length;
    $("#results-count").text(`${count} videos`);

    if (Object.keys(courses).length) {
      for (let c of courses) {
        let card = createCard(c);
        let $resultItem = $(`
      <div class="col-12 col-sm-4 col-lg-3 d-flex justify-content-center">
        ${card}
      </div>
     `);
        $results.append($resultItem);
      }
    }
  }

  /**
   * Calls the needed functions in order to correctly display
   * the search options in dom and results from API response
   * @data  {data} object containing data from API response
   * @return {string}  parsed title
   */
  function displaySearchAndResults(data) {
    displayResults(data);
    displaySearch(data);

    // END OF displayResults
  }

  /**
   * Function to show loader when waiting for API response
   * @active  {boolean} indicates whether loader should be displayed or
   * removed
   * @id  {string} Id of DOM object to attach loader to
   * @return {string}  parsed title
   */
  function displayLoader(active, id) {
    if (active) {
      let $loader = $(`<div class="loader" id="loader-${id}"></div>`);
      $(`#${id}`).append($loader);
    } else {
      let $loader = $(`#loader-${id}`);
      $loader.remove();
    }

    // END OF displayLoader
  }

  /**
   * Function to make GET request to API
   * @url  {string} url of API endpoint
   * @callback  {function} callback function to be executed
   * and that depends on the section of the web page which is being
   * generated by JS
   * @id  {string} Value needed to display loader
   * @data  {object} object to send in API request
   * @return {string}  parsed title
   */
  function requestData(url, callback, id, data = {}) {
    displayLoader(true, id);

    $.ajax({
      url: url,
      type: "GET",
      data: data,
      dataType: "xml",
      headers: { "Content-Type": "application/xml" },
      success: function (response) {
        displayLoader(false, id);
        callback(response);
      },
      error: function (error) {
        alert(`Error Getting Data from ${url}`);
      },
    });
    // END OF requestData
  }

  // PERFORM DYNAMIC CONTENT REQUESTS ===================================
  let requestsHomepage = [
    {
      url: "https://smileschool-api.hbtn.info/xml/quotes",
      func: displayQuotes,
      id: "carousel-items",
    },
    {
      url: "https://smileschool-api.hbtn.info/xml/popular-tutorials",
      func: displayPopular,
      id: "popular-items",
    },
    {
      url: "https://smileschool-api.hbtn.info/xml/latest-videos",
      func: displayLatest,
      id: "latest-videos-items",
    },
  ];

  let requestsPricing = [
    {
      url: "https://smileschool-api.hbtn.info/xml/quotes",
      func: displayQuotes,
      id: "carousel-items",
    },
  ];

  let requestsCourses = [
    {
      url: "https://smileschool-api.hbtn.info/xml/courses",
      func: displaySearchAndResults,
      id: "results-items",
    },
  ];

  let $homepage = $("#homepage");
  let $pricing = $("#pricing");
  let $courses = $("#courses");

  let requestObject;

  if (Object.keys($homepage).length) requestObject = requestsHomepage;
  else if (Object.keys($pricing).length) requestObject = requestsPricing;
  else if (Object.keys($courses).length) requestObject = requestsCourses;

  for (let r of requestObject) {
    requestData(r.url, r.func, r.id);
  }

  // ======================================================================

  //   END OF DOCUMENT READY
});
