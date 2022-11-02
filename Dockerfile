FROM baseImage

RUN apt-get install -y openssh-server
RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config

RUN useradd -m -s /bin/bash -G sudo -p $(openssl passwd -1 eee) ssluser
RUN apt-get install -y python3
RUN apt-get install -y sudo
RUN apt-get install -y net-tools
ENTRYPOINT service ssh start && <something that waits, e.g. a small httpserver>