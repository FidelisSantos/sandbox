import { useEffect, useState } from "react";
import { socketService } from "../services/socket";

import { useSandbox,  } from "../services";
import { SandboxService } from "../services/sandbox";
import type { Movie } from "../types";
import type { IRequest } from "../interface";



export function useApp() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [isSandbox, setIsSandbox] = useState(false);
    const [request, setRequest] = useState<IRequest>(useSandbox(isSandbox));
    const [isLoading, setIsLoading] = useState(false);
    socketService.connect();

    useEffect(() => {
        request?.getMovies().then(setMovies);
    }, [request]);

    function handleCreated() {
        request?.getMovies().then(setMovies);
    }

    async function handleToggleSandbox(newSandboxState: boolean) {
        try {
        setIsLoading(true);
        setMovies([]); 
        if (newSandboxState) {
            await initSandbox();
        } else {
            confirm("Se você voltar para a API, todos os filmes salvos serão deletados. Deseja continuar?") && await finishSandbox();
        }
        } catch (error) {
        console.error('Erro ao alternar modo:', error);
        } finally {
        setIsLoading(false);
        }
    }

    async function finishSandbox() {
        await SandboxService.deleteDb();
        const newRequest = useSandbox(false);
        setRequest(newRequest);
        setIsSandbox(false);
        const apiMovies = await newRequest.getMovies();
        setMovies(apiMovies);
    }

    async function initSandbox() {
        await SandboxService.createTablesToMovies();
        const newRequest = useSandbox(true);
        setRequest(newRequest);
        setIsSandbox(true);
        const sandboxMovies = await newRequest.getMovies();
        setMovies(sandboxMovies);
    }

    async function handleSaveMovies() {
        const sandboxMovies = await request?.getMovies();
        socketService.saveMovies(sandboxMovies);
        setIsLoading(true);
    }

    socketService.onSaveMoviesSuccess(async () => {
        setIsLoading(false);
        await finishSandbox();
    });

    socketService.onSaveMoviesError(() => {
        setIsLoading(false);
        alert("Erro ao salvar filmes");
    });


    async function handleDeleteMovie(id: number) {
        confirm("Tem certeza que deseja deletar este filme?") && await request?.deleteMovie(id);
        await request?.getMovies().then(setMovies);
    }

    return {
        movies,
        showModal,
        isSandbox,
        isLoading,
        handleToggleSandbox,
        handleCreated,
        handleDeleteMovie,
        handleSaveMovies,
        setShowModal,
        request,
    }
}