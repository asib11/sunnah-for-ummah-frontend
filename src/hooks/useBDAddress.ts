"use client";

import { useState, useMemo } from "react";
import divisionsRaw from "@/data/bd-address/divisions.json";
import districtsRaw from "@/data/bd-address/districts.json";
import upazilasRaw from "@/data/bd-address/upazilas.json";

// ── IDs from the nuhil dataset ──────────────────────────────
const DHAKA_DIVISION_ID = "6";
const DHAKA_DISTRICT_ID = "47";

// ── Dhaka City Thanas (hardcoded — JSON has no thana-level data) ──
const DHAKA_CITY_THANAS: { name: string; postCode: string }[] = [
  { name: "Adabor",               postCode: "1207" },
  { name: "Badda",                postCode: "1212" },
  { name: "Bangsal",              postCode: "1100" },
  { name: "Biman Bandar",         postCode: "1229" },
  { name: "Cantonment",           postCode: "1206" },
  { name: "Chowkbazar",           postCode: "1100" },
  { name: "Dakshin Khan",         postCode: "1230" },
  { name: "Darussalam",           postCode: "1216" },
  { name: "Demra",                postCode: "1361" },
  { name: "Dhanmondi",            postCode: "1209" },
  { name: "Gendaria",             postCode: "1100" },
  { name: "Gulshan",              postCode: "1212" },
  { name: "Hazaribagh",           postCode: "1209" },
  { name: "Jatrabari",            postCode: "1362" },
  { name: "Kafrul",               postCode: "1216" },
  { name: "Kadamtali",            postCode: "1362" },
  { name: "Kalabagan",            postCode: "1205" },
  { name: "Kamrangirchar",        postCode: "1211" },
  { name: "Khilgaon",             postCode: "1219" },
  { name: "Khilkhet",             postCode: "1229" },
  { name: "Kotwali",              postCode: "1100" },
  { name: "Lalbagh",              postCode: "1211" },
  { name: "Mirpur",               postCode: "1216" },
  { name: "Mohammadpur",          postCode: "1207" },
  { name: "Motijheel",            postCode: "1000" },
  { name: "Mugda",                postCode: "1214" },
  { name: "New Market",           postCode: "1205" },
  { name: "Pallabi",              postCode: "1216" },
  { name: "Paltan",               postCode: "1000" },
  { name: "Rampura",              postCode: "1219" },
  { name: "Ramna",                postCode: "1000" },
  { name: "Rupnagar",             postCode: "1216" },
  { name: "Sabujbagh",            postCode: "1214" },
  { name: "Shah Ali",             postCode: "1216" },
  { name: "Shahbag",              postCode: "1000" },
  { name: "Shahjahanpur",         postCode: "1217" },
  { name: "Sher-e-Bangla Nagar",  postCode: "1207" },
  { name: "Shyampur",             postCode: "1362" },
  { name: "Sutrapur",             postCode: "1100" },
  { name: "Tejgaon",              postCode: "1208" },
  { name: "Tejgaon I/A",          postCode: "1208" },
  { name: "Turag",                postCode: "1230" },
  { name: "Uttara East",          postCode: "1230" },
  { name: "Uttara West",          postCode: "1230" },
  { name: "Uttarkhan",            postCode: "1230" },
  { name: "Vatara",               postCode: "1212" },
  { name: "Wari",                 postCode: "1203" },
];

// ── Raw data typed ────────────────────────────────────────────
type Division = { id: string; name: string };
type District  = { id: string; name: string; division_id: string };
type Upazila   = { id: string; name: string; district_id: string };

const allDivisions: Division[] = (divisionsRaw as any[]).map((d) => ({ id: d.id, name: d.name }));
const allDistricts: District[]  = (districtsRaw  as any[]).map((d) => ({ id: d.id, name: d.name, division_id: d.division_id }));
const allUpazilas:  Upazila[]   = (upazilasRaw   as any[]).map((u) => ({ id: u.id, name: u.name, district_id: u.district_id }));

// ── Public state shape ────────────────────────────────────────
export type BDAddressState = {
  divisionId:   string;
  divisionName: string;
  districtId:   string;
  districtName: string;
  /** Thana (Dhaka city) or Upazila (everywhere else) */
  areaName:     string;
  postCode:     string;
  /** true only when Dhaka district (id=47) is selected */
  isInsideDhaka: boolean;
};

const EMPTY: BDAddressState = {
  divisionId: "", divisionName: "",
  districtId: "", districtName: "",
  areaName: "", postCode: "",
  isInsideDhaka: false,
};

// ── Area item used in dropdowns ───────────────────────────────
export type AreaOption = { name: string; postCode: string };

export function useBDAddress() {
  const [state, setState] = useState<BDAddressState>(EMPTY);

  // Districts for selected division
  const districts = useMemo(
    () => allDistricts.filter((d) => d.division_id === state.divisionId),
    [state.divisionId]
  );

  // Area options depend on which district is selected
  const areas: AreaOption[] = useMemo(() => {
    if (!state.districtId) return [];

    if (state.districtId === DHAKA_DISTRICT_ID) {
      // Dhaka city → show hardcoded thanas
      return DHAKA_CITY_THANAS;
    }

    // Everywhere else → upazilas from JSON (no postcode available)
    return allUpazilas
      .filter((u) => u.district_id === state.districtId)
      .map((u) => ({ name: u.name, postCode: "" }));
  }, [state.districtId]);

  function pickDivision(id: string) {
    const div = allDivisions.find((d) => d.id === id);
    setState({ ...EMPTY, divisionId: id, divisionName: div?.name ?? "" });
  }

  function pickDistrict(id: string) {
    const dist = allDistricts.find((d) => d.id === id);
    const isInsideDhaka = id === DHAKA_DISTRICT_ID;
    setState((prev) => ({
      ...prev,
      districtId: id,
      districtName: dist?.name ?? "",
      areaName: "",
      postCode: "",
      isInsideDhaka,
    }));
  }

  function pickArea(name: string) {
    // Find postcode from the current areas list
    const found = areas.find((a) => a.name === name);
    setState((prev) => ({
      ...prev,
      areaName: name,
      postCode: found?.postCode ?? "",
    }));
  }

  return {
    divisions: allDivisions,
    districts,
    areas,
    state,
    pickDivision,
    pickDistrict,
    pickArea,
    isDhakaDivision: state.divisionId === DHAKA_DIVISION_ID,
    isDhakaCity:     state.districtId === DHAKA_DISTRICT_ID,
  };
}
