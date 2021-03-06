/* --------------------------------------------
 Nav Menu
 --------------------------------------------- */


function et_nav_menu() {
  // Make multi level bootstrap menu
  $('.navbar  a.dropdown-toggle').on('click', function(e) {
    var $el = $(this);
    var $parent = $el.offsetParent(".dropdown-menu");
    if (!$el.offsetParent(".dropdown-menu").hasClass('mega_menu')) {
      $el.parent("li").toggleClass('show');
      if (!$parent.parent().hasClass('navbar-nav')) {
        if (!$el.parent().hasClass('mega_menu_holder') && !$("nav").hasClass("sidebar-nav")) {
          $el.next().css({
            "top": $el[0].offsetTop,
            "left": $parent.outerWidth() - 4
          });
        }
      }
    }
    $('.nav li.show').not($(this).parents("li")).removeClass("show");
    return false;
  });
  // Add current class to active menu's item
  var url = window.location;
  $('.navbar a').filter(function() {
    el = $(this);
    return el.href == url;
  }).parents('li').addClass('current');

  // For toggle classes
  var etcodes_delegate = function(criteria, listener) {
    return function(e) {
      var el = e.target;
      do {
        if (!criteria(el)) continue;
        e.delegateTarget = el;
        listener.apply(this, arguments);
        return;
      } while ((el = el.parentNode));
    };
  };
  var m_scene = document.querySelector(".m-scene");

  //For hamburger-menu-btn
  var hamburgerMenuBtnFilter = function(elem) {
    return elem.classList && elem.classList.contains("hamburger-menu-btn");
  };
  var hamburgerMenuBtnHandler = function(e) {
    var button = e.delegateTarget;
    if (!button.classList.contains("is-active"))
      button.classList.add("is-active");
    else
      button.classList.remove("is-active");
  };
  m_scene.addEventListener("click", etcodes_delegate(hamburgerMenuBtnFilter, hamburgerMenuBtnHandler));

  //For fullscreen-menu-holder
  var fullscreenMenuHandler = function(e) {
    var target_elm = $('.fullscreen-menu-holder');
    if (!target_elm.hasClass("is-active"))
      target_elm.addClass("is-active");
    else
      target_elm.removeClass("is-active");
  };
  m_scene.addEventListener("click", etcodes_delegate(hamburgerMenuBtnFilter, fullscreenMenuHandler));

}


/* --------------------------------------------
 owl carousel calling function
 --------------------------------------------- */
function owl_main_carousel() {
  if ($('#main-carousel').length) {
    var owl = $("#main-carousel");
    owl.owlCarousel({
      nav: true, // Show next and prev buttons
      smartSpeed: 1000,
      dotsSpeed: 1000,
      dragEndSpeed: true,
      dragEndSpeed: 1000,
      singleItem: true,
      pagination: true,
      items: 1,
      loop: true,
      afterAction: function(el) {
        //remove class active
        this
          .$owlItems
          .removeClass('active')

        //add class active
        this
          .$owlItems //owl internal $ object containing items
          .eq(this.currentItem + 1)
          .addClass('active')
      }
    });
  }
}

function owl_main_carousel_two() {
  var owl = $("#main-carousel_two");
  if (owl.length) {
    owl.owlCarousel({
      nav: false, // Show next and prev buttons
      smartSpeed: 1000,
      dots: false,
      dragEndSpeed: true,
      dragEndSpeed: 1000,
      singleItem: true,
      items: 1,
      loop: true,
    });
  }
}

/* ---------------------------------------------
 Scripts initialization
 --------------------------------------------- */

$(document).ready(function() {
  owl_main_carousel();
  owl_main_carousel_two();
  et_nav_menu();
});


/* ---------------------------------------------
 Register page upload photo
 --------------------------------------------- */

$('#fileUpload').on('change', function() {
  $('.avatar').removeClass('open');
});
$('.avatar').on('click', function() {
  $(this).addClass('open');
});
// added code to close the modal if you click outside
$('html').click(function() {
  $('.avatar').removeClass('open');
});

$('.avatar').click(function(event) {
  event.stopPropagation();
});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('.avatar')
        .css('background-image', 'url(' + e.target.result + ')')
    };

    reader.readAsDataURL(input.files[0]);
  }
}


/ Password verification script /
var password = document.getElementById("password"),
  confirm_password = document.getElementById("repeat-password");

function validatePassword() {
  if (password.value != confirm_password.value) {
    confirm_password.setCustomValidity("Password and confirm password should be same");
  } else {
    confirm_password.setCustomValidity('');
  }
}
if(password) password.onchange = validatePassword;
if(confirm_password) confirm_password.onkeyup = validatePassword;
/ Password verification script end /

$(document).ready(function() {
  $('#datePicker')
    .datepicker({
      format: 'mm/dd/yyyy',
      autoclose: true
    })
});




/* ---------------------------------------------
      Kilometer range slider
      --------------------------------------------- */

var sheet = document.createElement('style'),
  $rangeInput = $('.range input'),
  prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];

document.body.appendChild(sheet);

var getTrackStyle = function (el) {
  var curVal = el.value,
      val = (curVal - 1) * 19.5,
      style = '';

  // Set active label
  $('.range-labels li').removeClass('active selected');

  var curLabel = $('.range-labels').find('li:nth-child(' + curVal + ')');

  curLabel.addClass('active selected');
  curLabel.prevAll().addClass('selected');

  // Change background gradient
  for (var i = 0; i < prefs.length; i++) {
    style += '.range {background: linear-gradient(to right, #3494E6 0%, #3494E6 ' + val + '%, #fff ' + val + '%, #fff 100%)}';
    style += '.range input::-' + prefs[i] + '{background: linear-gradient(to right, #3494E6 0%, #3494E6 ' + val + '%, #b2b2b2 ' + val + '%, #b2b2b2 100%)}';
  }

  return style;
}

$rangeInput.on('input', function () {
  sheet.textContent = getTrackStyle(this);
});

// Change input value on label click
$('.range-labels li').on('click', function () {
  var index = $(this).index();
  $rangeInput.val(index + 1).trigger('input');
  var sliderValue = $(this).text()
});
