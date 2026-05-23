import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Music, Users, Zap } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">SoundWave</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline" className="rounded-full">
                Ingia
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="rounded-full bg-primary text-primary-foreground">
                Jisajili
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
              Shiriki Nyimzo Zako<br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Duniani Nzima
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              SoundWave ni platform ambayo msanii anaweza kupakia, kushiriki, na kujua mahitaji ya kila nyimzo ya wasikilizaji wao
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="rounded-full bg-primary text-primary-foreground px-8">
                  Anzisha Akaunti Yako
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Ingia
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-card border border-border/40 rounded-2xl p-8 hover:border-primary/40 transition">
              <Music className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Pakua Nyimzo</h3>
              <p className="text-muted-foreground">
                Pakua nyimzo zako kwa kualiti ya juu na haraka. Faili zote zinalindwa salama
              </p>
            </div>

            <div className="bg-card border border-border/40 rounded-2xl p-8 hover:border-primary/40 transition">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Shiriki Duniani</h3>
              <p className="text-muted-foreground">
                Milioni za wasikilizaji wanaotaka kusikiliza muziki mpya kila siku
              </p>
            </div>

            <div className="bg-card border border-border/40 rounded-2xl p-8 hover:border-primary/40 transition">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Kuona Takwimu</h3>
              <p className="text-muted-foreground">
                Angalia mahitaji ya kila nyimzo na kujua watafiti wanakosikilia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-foreground mb-16 text-center">
            Jinsi ya Kuanza
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Jisajili</h3>
              <p className="text-muted-foreground">
                Fungua akaunti yako kwa haraka kwa email
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Ingia</h3>
              <p className="text-muted-foreground">
                Ingia kwenye dashboard yako
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Pakua</h3>
              <p className="text-muted-foreground">
                Dondosha nyimzo zako au bonyeza kupakia
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Shiriki</h3>
              <p className="text-muted-foreground">
                Shiriki na wasikilizaji milioni za duniani
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 bg-gradient-to-r from-primary to-accent rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">
            Uko Tayari?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Jisajili leo na anza kumuuza muziki wako
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8">
              Jisajili Sasa
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-background/50">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 SoundWave. Haki zote zimehifadhiwa.</p>
        </div>
      </footer>
    </main>
  )
}