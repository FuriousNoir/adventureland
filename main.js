let attack_mode = true;
let items_for_sale = [ "beewings", "stinger" ];
let isize = 42;
let character_name = "Kristjan";
let zero = null;

setInterval(
	function(){

	if (character.hp < 1300) {
		use_skill('use_hp');
	}
		
	if (character.mp < 100) {
		use_skill('use_mp');
	}
		
	loot();
	sell_items();
	if (is_moving(character)) return;
	let go = buy_mp();
	if (go || !attack_mode || character.rip || is_moving(character)) return;

	var target=get_targeted_monster();
	if(!target)
	{
		target=get_nearest_monster({ type : "bee" });
		if (!target) smart_move("bee");
		if(target) change_target(target);
		else
		{
			set_message("No Monsters");
			return;
		}
	}
	
	if(!is_in_range(target))
	{
		smart_move(target);
	}
	else if(can_attack(target))
	{
		set_message("Attacking");
		attack(target);
	}

}
	,250); 

function sell_items() {
	if (character.esize < 5) {
		for (let item_for_sale of items_for_sale) {
			let item_for_sale_count = count_inventory_items(item_for_sale);
			if (item_for_sale_count > 0) {
				let coordinates = { x : -47, y : -120, map : "main" };
				smart_move(coordinates).then(() => {
					for (let i = 0; i < character.isize; i++) {
						let item = character.items[i];
						if (item != null && item.name == item_for_sale) {
							sell(i, item_for_sale_count);
						}
					}
					smart_move("bee");
				});

			}
		}
	}
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

function buy_hp() {
	let hp_q = count_inventory_items("hpot1");
	let hp_required = 9999 - hp_q;
	if (mp_q < 50 && character.gold >= (100 * hp_required)) {
		let coordinates = { x : -47, y : -120, map : "main" };
		smart_move(coordinates).then(() => {
			buy_with_gold("hpot1", hp_required);
			smart_move("bee");

		});
	}

	return false;
}

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