<?php
/*
 * A regular page for logged in users, where their submitted posts are listed with buttons which open the modals where the add/edit forms are shown
 * the regular page structure  (wp-head/wp-footer) is not included in this code
 */
?>

<a data-fancybox data-src="#newcampaign" href="javascript:;" class="button"><?php _e( 'Add new campaign' ); ?></a>
<div id="newcampaign" class="modal wrap">
	<h2><?php _e('Add new campaign'); ?></h2>
	<?php form_campaign_new(); ?> <!-- this contains a shortcode to display the add new post acf_form-->
</div>		
<h3><?php _e( 'Your campaigns'); ?></h3>
<?php 
	$current_user = wp_get_current_user();

	$args = array(
		'posts_per_page'	=> -1,
		'post_type'			=> 'campaign',
		'post_status'		=> array('draft', 'pending', 'publish', 'paused'),
		'author'			=> $current_user->ID,
	);
	$customquery = new WP_Query($args);

	if( $customquery->have_posts()) :

?>
	<table width="100%" border="0" cellpadding="0">
		<tbody>
			<tr>
			    <th><?php _e('Systemname und Adresse');?></th>
			    <th><?php _e('Branchen');?></th>
			    <th colspan="2"><?php _e('Typ');?></th>
			 </tr>

			<?php while ( $customquery->have_posts()) : $customquery->the_post();
				$post_id = get_the_ID();
				$konzept_id = get_konzept_id(); 
				$status = get_post_status( $post_id );
				if ($status == 'publish') {
					$statuslabel = 'Published';
				}
				if ($status == 'draft' || $status == 'pending') {
					$statuslabel = 'Awaiting moderation';
				}
				if ($status == 'paused') {
					$statuslabel = 'Paused';
				}
				?>
			<tr>
				<td>
					<h4 class="campaign-title">
						<a href="<?php the_permalink() ?>" rel="bookmark" title="<?php the_title(); ?>">
							<?php the_title(); ?>
						</a>
					</h4>
					<div class="region-list"><?php the_terms( $post_id, 'region', '', ', ',' ');?></div>
					<span class="campaign-adresse"><?php campaign_adress(); ?></span>
				</td>
				<td>				
					<div class="tag-list"><?php the_terms( $konzept_id, 'branche', '', ',<br>',' ');?></div>		
				</td>
				<td align="center" width="100px">
					<?php campaign_typ();?>
				</td>
		        <td>
		        	<p><?php _e('Status'); ?>: <span class="status-<?php echo $status; ?>"><?php echo $statuslabel; ?></span></p>

		        	<a href="<?php the_permalink() ?>" class="button"><?php _e('View');?></a>

		        	<!-- Now this is where the magic happens! Each form gets a unique ID, to make sure nothing gets confusing.
		        		The form tag has an additional ID, for example <form id="acf-form-12128">, which consists of the field group ID (12) and the post ID (128). Only the "Add New" form from above has only the group ID as custom identificator -->
					<a data-fancybox data-src="#editcampaign-<?php echo $post_id;?>" href="javascript:;" class="button"><?php _e('Edit'); ?></a>
						<div id="editcampaign-<?php echo $post_id;?>" class="modal wrap">
							<h2><?php _e('Edit campaign'); ?></h2>
							<?php form_campaign_edit(); ?> <!-- again this is a shortcode which displays the correct acf_form to edit this post -->
						</div>

					<?php // these two buttons show an acf form without fields, that just updates the post status
						if ( $status == 'paused' ) {
							resume_button();
						}
						if ( $status == 'publish' ) {
							pause_button();
						}					
					?>
				</td>
		    </tr>
			<?php 
				endwhile; 
				endif;
				wp_reset_query();
			?>
		</tbody>
	</table>

<?php ?>