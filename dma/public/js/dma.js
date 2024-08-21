frappe.provide("dma.utils");

function set_query_for_district(frm) {
	frm.set_query("district", () => {
		return {
			filters: {
				state: frm.doc.state,
			},
		};
	});
}

function set_query_for_zone(frm) {
	frm.set_query("zone", () => {
		return {
			filters: {
				district: frm.doc.district,
			},
		};
	});
}

function set_query_for_ward(frm) {
	frm.set_query("ward", () => {
		return {
			filters: {
				zone: frm.doc.zone,
			},
		};
	});
}

dma.utils.handle_state_field = (frm) => {
	set_query_for_district(frm);
	// Clear the district if it does not belong to that state
	frappe.db.get_value("District", frm.doc.district, "state", (r) => {
		if (r.state != frm.doc.state) {
			frm.set_value("district", "");
			frm.set_value("zone", "");
			frm.set_value("ward", "");
		}
	});
};

dma.utils.handle_district_field = (frm) => {
	set_query_for_zone(frm);
	if (frm.doc.district) {
		frappe.db.get_value("District", frm.doc.district, "state", (r) => {
			frm.set_value("state", r.state);
		});
	}
};

dma.utils.handle_zone_field = (frm) => {
	set_query_for_ward(frm);
	if (frm.doc.zone) {
		frappe.db.get_value("Zone", frm.doc.zone, "district", (r) => {
			frm.set_value("district", r.district);
		});
	}
};

dma.utils.handle_ward_field = (frm) => {
	if (frm.doc.ward) {
		frappe.db.get_value("Ward", frm.doc.ward, "zone", (r) => {
			frm.set_value("zone", r.zone);
		});
	}
};

dma.utils.set_query_for_district = set_query_for_district;
dma.utils.set_query_for_zone = set_query_for_zone;
dma.utils.set_query_for_ward = set_query_for_ward;
