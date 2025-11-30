// src/components/invitation/RsvpSection.tsx (Versi Diperbarui)

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client"; // Sesuaikan path ini jika perlu
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send, CheckCircle2 } from "lucide-react";
import satinEmeraldBg from "@/assets/satin-emerald-bg.jpg";
import EditableText from "@/components/EditableText"; // Import komponen editing

// --- SCHEMAS TETAP SAMA ---
const rsvpSchema = z.object({
  guestName: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  willAttend: z.enum(["yes", "no"], { required_error: "Silakan pilih konfirmasi kehadiran" }),
  numberOfGuests: z.coerce.number().min(1, "Minimal 1 tamu").max(5, "Maksimal 5 tamu"),
  notes: z.string().max(500, "Catatan maksimal 500 karakter").optional(),
});

type RsvpFormData = z.infer<typeof rsvpSchema>;

// --- DATA EDITABLE (Local State Placeholder) ---
const initialEditableText = {
  sectionTitle: "Konfirmasi Kehadiran",
  sectionSubtitle: "Mohon konfirmasi kehadiran Anda",
  nameLabel: "Nama Lengkap *",
  attendanceLabel: "Konfirmasi Kehadiran *",
  guestCountLabel: "Jumlah Tamu *",
  notesLabel: "Catatan (Opsional)",
  submitButtonText: "Kirim Konfirmasi",
  successTitle: "Terima Kasih!",
  successMessage: "Konfirmasi kehadiran Anda telah kami terima.",
  successDetailYes: "Kami menantikan kehadiran Anda!",
  successDetailNo: "Terima kasih atas konfirmasinya.",
};


const RsvpSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editableText, setEditableText] = useState(initialEditableText); // State untuk teks

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RsvpFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      numberOfGuests: 1,
    },
  });

  const willAttend = watch("willAttend");

  // Fungsi untuk menyimpan perubahan teks
  const handleTextSave = (fieldName: keyof typeof initialEditableText) => (newContent: string) => {
    setEditableText(prev => ({ ...prev, [fieldName]: newContent }));
    console.log(`[RSVP TEXT] Field ${fieldName} diupdate: ${newContent}`);
    // Logic Nyata: updateSupabase('rsvp_text', { [fieldName]: newContent });
  };


  const onSubmit = async (data: RsvpFormData) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.from("rsvp_submissions").insert({
        guest_name: data.guestName,
        will_attend: data.willAttend === "yes",
        number_of_guests: data.numberOfGuests,
        notes: data.notes || null,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success(editableText.successTitle, {
        description: data.willAttend === "yes" 
          ? editableText.successDetailYes
          : editableText.successDetailNo
      });
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      toast.error("Terjadi kesalahan", {
        description: "Mohon coba lagi beberapa saat."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- TAMPILAN SETELAH SUBMIT (SUCCESS STATE) ---
  if (isSubmitted) {
    return (
      <section className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${satinEmeraldBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
        
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <div className="animate-fade-in space-y-6">
            <CheckCircle2 className="w-20 h-20 text-gold mx-auto" />
            <h2 className="text-4xl md:text-5xl font-bold text-gold">
              {/* EDITABLE TEXT: Judul Sukses */}
              <EditableText onSave={handleTextSave('successTitle')} tagName="span">
                {editableText.successTitle}
              </EditableText>
            </h2>
            <p className="text-xl text-foreground/80">
              {/* EDITABLE TEXT: Pesan Sukses */}
              <EditableText onSave={handleTextSave('successMessage')} tagName="span">
                {editableText.successMessage}
              </EditableText>
            </p>
            <div className="h-1 w-32 bg-gold/50 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  // --- TAMPILAN FORM RSVP UTAMA ---
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Backgrounds... (Tetap sama) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${satinEmeraldBg})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <div className="text-center space-y-4 mb-12 animate-slide-up">
          <h2 className="text-5xl md:text-6xl font-bold text-gold">
            {/* EDITABLE TEXT: Judul Section */}
            <EditableText onSave={handleTextSave('sectionTitle')} tagName="span">
              {editableText.sectionTitle}
            </EditableText>
          </h2>
          <div className="h-1 w-32 bg-gold/50 mx-auto" />
          <p className="text-lg text-foreground/70">
            {/* EDITABLE TEXT: Subjudul Section */}
            <EditableText onSave={handleTextSave('sectionSubtitle')} tagName="span">
              {editableText.sectionSubtitle}
            </EditableText>
          </p>
        </div>
        
        {/* RSVP Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
          <div className="p-8 bg-card/20 backdrop-blur-sm rounded-2xl border border-gold/20 space-y-6">
            
            {/* 1. Name Input */}
            <div className="space-y-2">
              <Label htmlFor="guestName" className="text-gold text-lg">
                {/* EDITABLE TEXT: Label Nama */}
                <EditableText onSave={handleTextSave('nameLabel')} tagName="span">
                  {editableText.nameLabel}
                </EditableText>
              </Label>
              <Input
                id="guestName"
                {...register("guestName")}
                placeholder="Masukkan nama lengkap Anda"
                className="bg-background/50 border-gold/30 focus:border-gold text-lg"
              />
              {errors.guestName && (
                <p className="text-destructive text-sm">{errors.guestName.message}</p>
              )}
            </div>
            
            {/* 2. Attendance Radio */}
            <div className="space-y-3">
              <Label className="text-gold text-lg">
                {/* EDITABLE TEXT: Label Kehadiran */}
                <EditableText onSave={handleTextSave('attendanceLabel')} tagName="span">
                  {editableText.attendanceLabel}
                </EditableText>
              </Label>
              <RadioGroup
                onValueChange={(value) => setValue("willAttend", value as "yes" | "no")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" className="border-gold text-gold" />
                  <Label htmlFor="yes" className="cursor-pointer text-base">Hadir</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" className="border-gold text-gold" />
                  <Label htmlFor="no" className="cursor-pointer text-base">Tidak Hadir</Label>
                </div>
              </RadioGroup>
              {errors.willAttend && (
                <p className="text-destructive text-sm">{errors.willAttend.message}</p>
              )}
            </div>
            
            {/* 3. Number of Guests */}
            {willAttend === "yes" && (
              <div className="space-y-2">
                <Label htmlFor="numberOfGuests" className="text-gold text-lg">
                  {/* EDITABLE TEXT: Label Jumlah Tamu */}
                  <EditableText onSave={handleTextSave('guestCountLabel')} tagName="span">
                    {editableText.guestCountLabel}
                  </EditableText>
                </Label>
                <Input
                  id="numberOfGuests"
                  type="number"
                  min="1"
                  max="5"
                  {...register("numberOfGuests")}
                  className="bg-background/50 border-gold/30 focus:border-gold text-lg"
                />
                {errors.numberOfGuests && (
                  <p className="text-destructive text-sm">{errors.numberOfGuests.message}</p>
                )}
              </div>
            )}
            
            {/* 4. Notes Textarea */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gold text-lg">
                {/* EDITABLE TEXT: Label Catatan */}
                <EditableText onSave={handleTextSave('notesLabel')} tagName="span">
                  {editableText.notesLabel}
                </EditableText>
              </Label>
              <Textarea
                id="notes"
                {...register("notes")}
                placeholder="Pesan atau ucapan untuk kami"
                rows={4}
                className="bg-background/50 border-gold/30 focus:border-gold resize-none"
              />
              {errors.notes && (
                <p className="text-destructive text-sm">{errors.notes.message}</p>
              )}
            </div>
          </div>
          
          {/* 5. Submit Button (Tidak bisa di-edit, hanya teksnya) */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-6 text-lg bg-primary hover:bg-primary/90 glow-gold transition-all duration-300"
          >
            {isLoading ? (
              "Mengirim..."
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                {/* EDITABLE TEXT: Teks Tombol Submit */}
                <EditableText onSave={handleTextSave('submitButtonText')} tagName="span">
                  {editableText.submitButtonText}
                </EditableText>
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default RsvpSection;