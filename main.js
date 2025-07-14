var attack_mode=true

setInterval(
	function(){

	if (character.hp < 1300) {
		use_skill('use_hp');
	}
		
	if (character.mp < 100) {
		use_skill('use_mp');
	}
		
	loot();
	if (is_moving(character)) return;
	let go = buy_mp();
	if (go || !attack_mode || character.rip || is_moving(character)) return;

	var target=get_targeted_monster();
	if(!target)
	{
		target=get_nearest_monster({min_xp:100,max_att:120});
		if(target) change_target(target);
		else
		{
			set_message("No Monsters");
			return;
		}
	}
	
	if(!is_in_range(target))
	{
		move(
			character.x+(target.x-character.x)/2,
			character.y+(target.y-character.y)/2
			);
		// Walk half the distance
	}
	else if(can_attack(target))
	{
		set_message("Attacking");
		attack(target);
	}

}
	,250); 

function buy_mp() {
	// If mp < 9999 && gold > (100*mp_required) then go to town (mpc merchand) and buy mp_required mp_potion
	// 1 = 9999-9998 mp_required = mp_max - mp_qurrent
	let mp_q = count_inventory_items("mpot1");
	let mp_required = 9999 - mp_q;
	if (mp_q < 50 && character.gold >= (100 * mp_required)) {
		let coordinates = { x : -40, y : -120, map : "main" };
		smart_move(coordinates).then(() => {
			buy_with_gold("mpot1", mp_required);
			smart_move("bee");

		});
	}

	return false;
}

function count_inventory_items(item_name) {
	let items = character.items;
	let result = 0;
	
	for (let item of items) {
		if (item != null && item.name == item_name) {
			result = result + item.q;
		}
	}

	return result;
}