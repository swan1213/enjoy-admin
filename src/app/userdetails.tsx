'use client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { UserX, Trash2, Loader2 } from 'lucide-react';
import { User } from "@/types";
import axios from "axios";
import baseUrl from "./baseurl";
import { useState } from "react";

interface UserDetailsModalProps {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onSuspendUser: (id: string) => void;
  onDeleteUser: (id: string) => void;
}

export default function UserDetailsModal({
  user,
  open,
  onClose,
  onSuspendUser,
  onDeleteUser
}: UserDetailsModalProps) {
  
  const savedToken = localStorage.getItem('token');
  const [isSuspending, setSuspending] = useState(false);
  const [isdeleting, setDeleting] = useState(false);
  
  if (!user) return null;
  
  const suspendUser = async(id: string) => {
    console.log(id);
    try {
      setSuspending(true);
      onSuspendUser(id);
      onClose()
    } catch (error) {
      alert('Erreur lors de la suspension de l\'utilisateur');
    } finally {
      setSuspending(false);
    }
  }
  
  const deleteUser = async(id: string) => {
    console.log(id);
    try {
      setDeleting(true);
      onDeleteUser(id)
      onClose()
    } catch (error) {
      alert('Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setDeleting(false);
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle> Détails du client </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p><strong>Nom :</strong> {user.firstName} {user.lastName}</p>
              <p><strong>E-mail :</strong> {user.email}</p>
              <p><strong>Téléphone :</strong> {user.phone}</p>
            </div>
            <div className="space-y-2">
              <p><strong>Statut :</strong>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.isActive ? 'Actif' : 'Suspendu'}
                </span>
              </p>
            </div>
          </div>
          
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={() => suspendUser(user.id)}
              variant={user.isActive ? "outline" : "default"}
              className="flex items-center gap-2"
            >
              {isSuspending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserX className="h-4 w-4" />}
              {user.isActive ? (isSuspending ? 'Suspension...' : 'Suspendre') : 'Activer'}
            </Button>
            <Button
              onClick={() => deleteUser(user.id)}
              variant="destructive"
              className="flex items-center gap-2"
            >
              {isdeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {isdeleting ? 'Suppression...' : 'Supprimer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}