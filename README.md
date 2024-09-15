# Network Planning Worksheet

This project is designed to help plan out a network for an organization with support for B2B VPN connections.

## Process

1) Start by defining an organization; such as `Acme Co.` and provide a network which all locations and networks will use.Ideally this network will be one of the primary Private IPv4 networks listed in the [Following Chart](#private-ipv4-networks)

2) Then start defining different locations for the organization. Such as `Head Quarters`, `Denver Branch`, etc.
Each of these locations will need its own network and CIDR. Typically these are between a 12 and 16 CIDR depending on how many networks will be required at each location.

3) Finally start defining your networks. These networks will be the ones your devices actually connect to. Name these things such as `Servers`, `Corp Wired`, `Corp Wireless`, `Printers` etc. 
Generally these networks are between a 20 and 30 CIDR depending on how many devices are expected to be on the network.

4) The last thing to do is fill out the security matrix by checking the boxes on which networks should be able to communicate with each other

## Helpful Charts

### Private IPv4 Networks
  | Class | Network | CIDR | # of Addresses |
  | --- | --- | --- | --- |
  | A | 10.0.0.0 | 8 | 16,777,216 |
  | B | 172.16.0.0 | 12 | 1,048,576 |
  | C | 192.168.0.0 | 16 | 65,536 |

### IPv4 CIDR Chart
| IP Addresses | CIDR | Subnet Mask |
| --- | --- | --- |
| 1 | 32 | 255.255.255.255 |
| 2 | 31 | 255.255.255.254 |
| 4 | 30 | 255.255.255.252 |
| 8 | 29 | 255.255.255.248 |
| 16 | 28 | 255.255.255.240 |
| 32 | 27 | 255.255.255.224 |
| 64 | 26 | 255.255.255.192 |
| 128 | 25 | 255.255.255.128 |
| 256 | 24 | 255.255.255.0 |
| 512 | 23 | 255.255.254.0 |
| 1,024 | 22 | 255.255.252.0 |
| 2,048 | 21 | 255.255.248.0 |
| 4,096 | 20 | 255.255.240.0 |
| 8,192 | 19 | 255.255.224.0 |
| 16,384 | 18 | 255.255.192.0 |
| 32,768 | 17 | 255.255.128.0 |
| 65,536 | 16 | 255.255.0.0 |
| 131,072 | 15 | 255.254.0.0 |
| 262,144 | 14 | 255.252.0.0 |
| 524,288 | 13 | 255.248.0.0 |
| 1,048,576 | 12 | 255.240.0.0 |
| 2,097,152 | 11 | 255.224.0.0 |
| 4,194,304 | 10 | 255.192.0.0 |
| 8,388,608 | 9 | 255.128.0.0 |
| 16,777,216 | 8 | 255.0.0.0 |
| 33,554,432 | 7 | 254.0.0.0 |
| 67,108,864 | 6 | 252.0.0.0 |
| 134,217,728 | 5 | 248.0.0.0 |
| 268,435,456 | 4 | 240.0.0.0 |
| 536,870,912 | 3 | 224.0.0.0 |
| 1,073,741,824 | 2 | 192.0.0.0 |
| 2,147,483,648 | 1 | 128.0.0.0 |
| 4,294,967,296 | 0 | 0.0.0.0 |