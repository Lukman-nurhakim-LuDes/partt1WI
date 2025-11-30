import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send, CheckCircle2 } from "lucide-react";
import satinEmeraldBg from "@/assets/satin-emerald-bg.jpg";

const rsvpSchema = z.object({
  guestName: z.string().min(2, "Nama minimal 2 karakter").max(100, "Nama maksimal 100 karakter"),
  willAttend: z.enum(["yes", "no"], { required_error: "Silakan pilih konfirmasi kehadiran" }),
  numberOfGuests: z.coerce.number().min(1, "Minimal 1 tamu").max(5, "Maksimal 5 tamu"),
  notes: z.string().max(500, "Catatan maksimal 500 karakter").optional(),
});

type RsvpFormData = z.infer<typeof rsvpSchema>;

const RsvpSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      toast.success("Terima kasih! Konfirmasi Anda telah diterima.", {
        description: data.willAttend === "yes" 
          ? "Kami menantikan kehadiran Anda!"
          : "Terima kasih atas konfirmasinya."
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
              Terima Kasih!
            </h2>
            <p className="text-xl text-foreground/80">
              Konfirmasi kehadiran Anda telah kami terima.
            </p>
            <div className="h-1 w-32 bg-gold/50 mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Emerald Satin Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url(${satinEmeraldBg})` }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <div className="text-center space-y-4 mb-12 animate-slide-up">
          <h2 className="text-5xl md:text-6xl font-bold text-gold">
            Konfirmasi Kehadiran
          </h2>
          <div className="h-1 w-32 bg-gold/50 mx-auto" />
          <p className="text-lg text-foreground/70">
            Mohon konfirmasi kehadiran Anda
          </p>
        </div>
        
        {/* RSVP Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
          <div className="p-8 bg-card/20 backdrop-blur-sm rounded-2xl border border-gold/20 space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="guestName" className="text-gold text-lg">
                Nama Lengkap *
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
            
            {/* Attendance Radio */}
            <div className="space-y-3">
              <Label className="text-gold text-lg">
                Konfirmasi Kehadiran *
              </Label>
              <RadioGroup
                onValueChange={(value) => setValue("willAttend", value as "yes" | "no")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" className="border-gold text-gold" />
                  <Label htmlFor="yes" className="cursor-pointer text-base">
                    Hadir
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" className="border-gold text-gold" />
                  <Label htmlFor="no" className="cursor-pointer text-base">
                    Tidak Hadir
                  </Label>
                </div>
              </RadioGroup>
              {errors.willAttend && (
                <p className="text-destructive text-sm">{errors.willAttend.message}</p>
              )}
            </div>
            
            {/* Number of Guests */}
            {willAttend === "yes" && (
              <div className="space-y-2">
                <Label htmlFor="numberOfGuests" className="text-gold text-lg">
                  Jumlah Tamu *
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
            
            {/* Notes Textarea */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-gold text-lg">
                Catatan (Opsional)
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
          
          {/* Submit Button */}
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
                Kirim Konfirmasi
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default RsvpSection;
