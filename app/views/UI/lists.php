<ul class="books cl">
<?php foreach($list as $v):?>
	<li class="line1 " nname="1">
		<a id="ember457" href="<?php echo $v['url'];?>" title="<?php echo $v['title'];?>"
						   class="ember-view"> <img src="/public/<?php echo $v['img'];?>"
													alt="<?php echo $v['title'];?>">
						</a>
						<p class="name">
							<a id="ember472" href="<?php echo $v['url'];?>" class="ember-view">
								<?php echo $v['title'];?>
							</a></p>
						<p class="author"><span class="author_t"></span><?php echo $v['autor'];?></p>
						<p class="price">
            <span class="rob">
                <span class="sign">¥</span>
                <span class="num_1"><?php echo $v['price'][0];?></span><span class="tail">.<?php echo $v['price'][1];?></span></span></div>
					</li>
		<?php endforeach;?>	
</ul>