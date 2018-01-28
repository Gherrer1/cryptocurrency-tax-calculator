/**
 * @param dateStr A string in the form YYYY-MM-DD HH:MM:SS
 * @return {Date} A date created from new Date('YYYY-MM-DDTHH:MM:SSZ')
 */
export default function isoFormat(dateStr, timeStr) {
  let isoFormattedDate = `${dateStr}T${timeStr}Z`;
  return new Date(isoFormattedDate);
}
