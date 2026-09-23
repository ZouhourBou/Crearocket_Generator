import { ChildProfile } from './types';
import { Language } from '../../types';

export function personalizeText(
  rawText: string,
  child: ChildProfile,
  language: Language
): string {
  if (!rawText) return '';

  const name = child.name.trim() || (language === 'ar' ? 'لينا' : language === 'en' ? 'Lily' : 'Lina');
  const isGirl = child.gender === 'girl';
  const isBoy = child.gender === 'boy';

  // Default values when optional fields are empty
  const defaultAnimal =
    child.favoriteAnimal?.trim() ||
    (language === 'ar' ? 'الأرنب اللطيف' : language === 'en' ? 'little rabbit' : 'petit renard');

  const defaultColor =
    child.favoriteColor?.trim() ||
    (language === 'ar' ? 'الأزرق السماوي' : language === 'en' ? 'sky blue' : 'bleu ciel');

  const defaultActivity =
    child.favoriteActivity?.trim() ||
    (language === 'ar' ? 'الرسم واكتشاف النجوم' : language === 'en' ? 'drawing and stargazing' : 'dessiner et explorer les étoiles');

  let text = rawText;

  // Common replacements
  text = text.replace(/\{\{childName\}\}/g, name);
  text = text.replace(/\{\{childAge\}\}/g, String(child.age));
  text = text.replace(/\{\{nickname\}\}/g, child.nickname?.trim() || name);
  text = text.replace(/\{\{favoriteAnimal\}\}/g, defaultAnimal);
  text = text.replace(/\{\{favoriteColor\}\}/g, defaultColor);
  text = text.replace(/\{\{favoriteActivity\}\}/g, defaultActivity);
  text = text.replace(/\{\{dedication\}\}/g, child.dedication?.trim() || '');
  text = text.replace(/\{\{giftFrom\}\}/g, child.giftFrom?.trim() || '');

  // French Grammatical Agreements
  if (language === 'fr') {
    text = text.replace(/\{\{accord_e\}\}/g, isGirl ? 'e' : '');
    text = text.replace(/\{\{accord_ne\}\}/g, isGirl ? 'ne' : '');
    text = text.replace(/\{\{ami_e\}\}/g, isGirl ? 'amie' : 'ami');
    text = text.replace(/\{\{il_elle\}\}/g, isGirl ? 'elle' : 'il');
    text = text.replace(/\{\{Il_Elle\}\}/g, isGirl ? 'Elle' : 'Il');
    text = text.replace(/\{\{petit_petite\}\}/g, isGirl ? 'petite' : 'petit');
    text = text.replace(/\{\{Petit_Petite\}\}/g, isGirl ? 'Petite' : 'Petit');
    text = text.replace(/\{\{curieux_curieuse\}\}/g, isGirl ? 'curieuse' : 'curieux');
    text = text.replace(/\{\{courageux_courageuse\}\}/g, isGirl ? 'courageuse' : 'courageux');
    text = text.replace(/\{\{heureux_heureuse\}\}/g, isGirl ? 'heureuse' : 'heureux');
    text = text.replace(/\{\{notre_cher_chere\}\}/g, isGirl ? 'notre chère' : 'notre cher');
    text = text.replace(/\{\{son_sa\}\}/g, isGirl ? 'sa' : 'son');
  }

  // Arabic Grammatical Agreements
  if (language === 'ar') {
    text = text.replace(/\{\{huwa_hiya\}\}/g, isGirl ? 'هي' : 'هو');
    text = text.replace(/\{\{Huwa_Hiya\}\}/g, isGirl ? 'هي' : 'هو');
    text = text.replace(/\{\{batal\}\}/g, isGirl ? 'بطلتنا الرائعة' : 'بطلنا الشجاع');
    text = text.replace(/\{\{Batal\}\}/g, isGirl ? 'بطلتنا' : 'بطلنا');
    text = text.replace(/\{\{saghir\}\}/g, isGirl ? 'الصغيرة' : 'الصغير');
    text = text.replace(/\{\{sadiq\}\}/g, isGirl ? 'صديقتها' : 'صديقه');
    text = text.replace(/\{\{ta_faala\}\}/g, isGirl ? 'ت' : 'ي'); // e.g. تبتسم / يبتسم
    text = text.replace(/\{\{dhahaba_at\}\}/g, isGirl ? 'ذهبت' : 'ذهب');
    text = text.replace(/\{\{ra_at\}\}/g, isGirl ? 'رأت' : 'رأى');
    text = text.replace(/\{\{fariha_at\}\}/g, isGirl ? 'فرحت' : 'فرح');
  }

  // English Grammatical Agreements
  if (language === 'en') {
    text = text.replace(/\{\{he_she\}\}/g, isGirl ? 'she' : 'he');
    text = text.replace(/\{\{He_She\}\}/g, isGirl ? 'She' : 'He');
    text = text.replace(/\{\{his_her\}\}/g, isGirl ? 'her' : 'his');
    text = text.replace(/\{\{His_Her\}\}/g, isGirl ? 'Her' : 'His');
    text = text.replace(/\{\{him_her\}\}/g, isGirl ? 'her' : 'him');
  }

  return text;
}
