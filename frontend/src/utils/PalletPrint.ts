import { alertController } from '@ionic/vue';
export const palletPrint = async (docname: string, t: (key: string) => string) => {
  const printFormat = "th_Pallets";
  const docType = "Pallets";
  
  if (!docname || docname.trim() === "") {
    const alert = await alertController.create({
	  header: t('pallets.print_error'),
	  message: t('pallets.print_error_message'),
	  buttons: [t('button.Ok')],
    });
    await alert.present();
    return;
  }


setTimeout(() => {
    const printUrl = `http://192.168.10.105/api/method/frappe.utils.print_format.download_pdf?doctype=${docType}&name=${docname}&format=${printFormat}&no_letterhead=0`;
    const printWindow = window.open(printUrl, "_blank");
  if (printWindow) {
    printWindow.focus();
    printWindow.print();
  } 
  else {
    console.error("Failed to open PDF window");
  }
}, 500); 
};