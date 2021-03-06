if (typeof jQuery != "undefined"){

	// On DOM Ready
	(function($){$(document).ready(function(){

		/**
		 * Notices
		 */
		// Show closing "X"s
		$("div.notice-close").show();
		//$('div.notice').width($('div.notice').width());

		// Close a notice if the "X" is clicked
		$('div.notice-close a').live("click", function(){
			var notice = $(this).closest("div.notice");
			var persistent = notice.hasClass('notice-persistent');
			notice.hide("fast");

			if (persistent){
				var ajax_url = $(this).attr("href");
				$.ajax({
					url: ajax_url,
					cache: false,
					dataType: 'json',
					success: $.noop(),
					error: $.noop()
				});
			}

			return false;
		});

		/**
		 * Event details loading via ajax
		 */
		// Ajax loading of event details
		// can't figure out why ul.header won't work for event binding
		// so using pointless class for the moment but this is problematic
		$('.event_title, .event_numbers, .event_time').click(function() {

			// Find container element for our event data
			var event_data = $(this).parent().siblings('section.event_data');
			var parent_li = $(this).parent().parent();

			// See if we've already loaded data for this event
			if ( ! parent_li.hasClass('loaded'))
			{
				// ajax call to fetch event data
				$.get(parent_li.data('url'), function(data) {
					event_data.html(data);

					// setup for jquery ui tabs
					event_data.find('.tabs').tabs();

					// mark event has having all data loaded
					parent_li.addClass('loaded');

					parent_li.toggleClass('event_collapsed event_expanded');

					event_data.slideDown('slow');
				});
			}
			else
			{
				// Toggle details display
				if (parent_li.hasClass('event_collapsed'))
				{
					parent_li.toggleClass('event_collapsed event_expanded');

					event_data.slideDown('slow');
				}
				else
				{
					event_data.slideUp('slow', function() {
						$(parent_li).toggleClass('event_collapsed event_expanded');
					});
				}
			}
		});


		/**
		 * Modal windows
		 */
		$(document).on('click', 'a.modal', (function(e) {
			// Prevent click on anchor from loading new page
			e.preventDefault();
			
			url = $(this).attr('href');
			
			// Create modal from anchor's href
			jQuery.facebox(function($) {
				jQuery.get(url, function(data) { 
					jQuery.facebox(data) 
				});
			});
			return false;
		}));
		
		/**
		 * Dynamic character search used in reassignment
		 */
		$(document).on('keyup', '.character_search', function(e) {
			val = $(this).val();

			if (val.length >= 3) {
				$.ajax({
					type: "GET",
					url: "/admin/event/character",
					data: {'q' : val},
					dataType: "text",
					success: function(msg){
						var character_list = $.parseJSON(msg);
						var output = '';
						
						$.each(character_list, function(index, character) {
							if (character)
							{
								output += '<li><a href="#" class="character_list_anchor" data-profession="'+character.name+'"><img src="/media/img/profession_icons/'+character.profession+'-small.png" />'+character.name+'</a></li>';
							}
						});
						
						$('#character_list > ul').html(output);
					}
				});
			}
		});
	
		/**
		 * Character input autofill from list
		 */
		$(document).on('click', '.character_list_anchor', function(e) {
			val = $(this).data('profession');
			$('input.character_search').val(val);
			
			e.preventDefault();
		});

		// Handling dropdown event filter list
		$('#event_filters').change(function(e) {
			window.open(this.value, '_self');
		});

		// Open event details when linked directly w/ named anchor
		if (window.location.hash != '')
		{
			$(window.location.hash).find('.event_title').click();
		}

		/**
		 * Toastr notifications
		 */
		$(notice_data).each(function(index, val) {
			var notice_types = ['success', 'error', 'warning', 'info'];
			
			if ($.inArray(val.type, notice_types) !== -1)
			{
				toastr[val.type](val.message);
			}
			else
			{
				toastr.info(val.message);
			}
		});
	})})(jQuery); // Prevent conflicts with other js libraries
}
