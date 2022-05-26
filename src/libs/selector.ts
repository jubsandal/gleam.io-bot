export const gleam_globe = "[class*='fa-globe-americas']"
export const gleam_triangle = "[class*='fa-exclamation-triangle']"

export const em = "div[id^='em']:not([class*=completed]).entry-method";
export const emContent = "div[class^='entry-content']:not([class*=ng-hide])"
export const emExpanded = em + ".expanded";
export const emDefault = em + " a[data-track-event*='###APP_NAME###'][class*='enter-link'][class*='default']"
export const emMandatory = emExpanded + " a[data-track-event*='###APP_NAME###']"
export const emVisible = emDefault + ", " + emMandatory
export const em_visitButton = emExpanded + " a[class*='btn-large']";
export const em_twitterButton = emExpanded + " [class='xl twitter-button']";
export const em_continueButton = emExpanded + " div[class*='form-actions'] [class*='btn-primary']";
export const em_continueEnabledButton = em_continueButton + ":not([disabled])";
export const em_fa_check = "[class*='fa-check']";

export const vf = emExpanded + " fieldset[class='inputs']";
// const vf = "fieldset[class='inputs']";

export const vf_inGameName = vf + " input[name='in_game_name']";
export const vf_state = vf + " select[name='state']";
export const vf_stateOther = vf + " input[name='stateOther']";
export const vf_country = vf + " select[name='country']";
export const vf_company = vf + " input[name='company']";
export const vf_birthDateMDY = vf + " input[name='date_of_birth'][age-format='MDY']";
export const vf_birthDateDMY = vf + " input[name='date_of_birth'][age-format='DMY']";
export const vf_checkbox = vf + " label[class='checkbox'] span[class='icon']"
export const vf_phone = vf + " [name='phone']";
export const vf_zip = vf + " [name='zip']";
export const vf_age = vf + " [name='age']";
export const vf_male = vf + " [value='Male']"
