(function ($) {
  $(document).ready(function($) {
    acf.do_action('ready', $('body'));

      $('.acf-form').on('submit', function(e){
          e.preventDefault();
      });

    acf.add_action('submit', function($form){
      $.ajax({
        url: window.location.href,
        method: 'post',
        data: $form.serialize(),
        success: function(data) {
          acf.validation.toggle($form, 'unlock');
                  alert(data);
        }
      });
    });
  });
})(jQuery);