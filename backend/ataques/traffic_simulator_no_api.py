import socket
import threading
import time
import random
import argparse

DEFAULT_PORTS = [21,22,23,25,53,80,110,139,143,443,445,993,995,8080,8443]
TEST_MESSAGE = b"PingSimulado"

def syn_flood_simulated(target_ip, ports, duration, threads, rate):
    stop_time = time.time() + duration
    def worker():
        while time.time() < stop_time:
            port = random.choice(ports)
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.settimeout(0.5)
                s.connect_ex((target_ip, port))
                s.close()
            except Exception:
                pass
            time.sleep(rate)
    ths = []
    for _ in range(threads):
        t = threading.Thread(target=worker, daemon=True)
        t.start()
        ths.append(t)
    for t in ths:
        t.join()

def ddos_simulated_udp(target_ip, duration, threads, pps):
    stop_time = time.time() + duration
    def worker():
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        while time.time() < stop_time:
            try:
                port = random.randint(1024, 65535)
                sock.sendto(TEST_MESSAGE, (target_ip, port))
            except Exception:
                pass
            time.sleep(1.0 / max(1, pps))
        sock.close()
    ths = []
    for _ in range(threads):
        t = threading.Thread(target=worker, daemon=True)
        t.start()
        ths.append(t)
    for t in ths:
        t.join()

def satan_portscan(target_ip, ports, duration, threads, delay):
    stop_time = time.time() + duration
    def worker():
        while time.time() < stop_time:
            for port in ports:
                try:
                    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                    s.settimeout(0.3)
                    s.connect_ex((target_ip, port))
                    s.close()
                except Exception:
                    pass
                time.sleep(delay)
    ths = []
    for _ in range(threads):
        t = threading.Thread(target=worker, daemon=True)
        t.start()
        ths.append(t)
    for t in ths:
        t.join()

def run_modes(target, mode, duration, threads, ports, rate, pps, delay):
    print(f"[SIM] Objetivo: {target} | modo: {mode} | duración: {duration}s")
    start = time.time()
    if mode in ("neptune", "all"):
        print("[SIM] Iniciando Neptune (SYN simulado)...")
        syn_threads = max(1, threads if mode=="neptune" else threads//2)
        syn_rate = rate  
        syn_flood_simulated(target, ports, duration, syn_threads, syn_rate)

    if mode in ("ddos", "all"):
        print("[SIM] Iniciando DDoS ligero (UDP)...")
        ddos_threads = max(1, threads if mode=="ddos" else threads//2)
        ddos_simulated_udp(target, duration, ddos_threads, pps)

    if mode in ("satan", "all"):
        print("[SIM] Iniciando SATAN (escaneo de puertos)...")
        satan_threads = max(1, threads if mode=="satan" else max(1, threads//2))
        satan_portscan(target, ports, duration, satan_threads, delay)

    elapsed = time.time() - start
    print(f"[SIM] Finalizado en {elapsed:.1f}s")

def parse_args():
    p = argparse.ArgumentParser(description="Traffic simulator for local sniffer testing (lab use only).")
    p.add_argument("--target", "-t", required=True, help="IP objetivo (la máquina con sniffer).")
    p.add_argument("--mode", "-m", choices=["neptune","ddos","satan","all"], default="all",
                   help="Tipo de simulación: neptune, ddos, satan, all")
    p.add_argument("--duration", "-d", type=int, default=10, help="Duración en segundos")
    p.add_argument("--threads", type=int, default=4, help="Número de hilos (por tarea)")
    p.add_argument("--ports", "-p", nargs="+", type=int, default=DEFAULT_PORTS, help="Lista de puertos para escaneo/SYN")
    p.add_argument("--rate", type=float, default=0.05, help="Delay (s) entre intentos en Neptune por hilo (mayor = menos tráfico)")
    p.add_argument("--pps", type=int, default=20, help="Paquetes por segundo por hilo para DDoS UDP (moderado)")
    p.add_argument("--delay", type=float, default=0.01, help="Delay entre intentos en escaneo (s)")
    return p.parse_args()

if __name__ == "__main__":
    args = parse_args()
    try:
        run_modes(
            target=args.target,
            mode=args.mode,
            duration=args.duration,
            threads=args.threads,
            ports=args.ports,
            rate=args.rate,
            pps=args.pps,
            delay=args.delay
        )
    except KeyboardInterrupt:
        print("\n[SIM] Interrumpido por usuario")
